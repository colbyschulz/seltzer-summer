import React, { FC } from 'react';

import { Race } from '../../types';
import { raceTimeToSeconds } from '../../utils';
import { useCreateRace } from '../../api/races';
import { StyledInput, StyledSelect, StyledDatePicker, FormItem } from './raceForm.css';
import Button from '../button/Button';
import { useUsers } from '../../api/users';
import { Col, Form, FormInstance, Row, Select } from 'antd';

interface RaceFormProps {
  formRef: FormInstance<FormValues>;
  handleClose: () => void;
}

interface FormValues {
  userId: string;
  firstName: string;
  lastName: string;
  raceName: string;
  hours: string;
  minutes: string;
  seconds: string;
  date: string;
  distance: string;
}

const DISTANCE_OPTIONS = [
  { label: '1 Mile', value: '1609.34' },
  { label: '5k', value: '5000' },
  { label: '10k', value: '10000' },
  { label: '10 Mile', value: '16093.4' },
  { label: 'Half Marathon', value: '21097.5' },
  { label: 'Marathon', value: '42195' },
];

const RaceForm: FC<RaceFormProps> = ({ formRef, handleClose }) => {
  const { mutate: createRaceMutation } = useCreateRace();
  const { data: users } = useUsers();
  const reset = formRef.resetFields;
  const userId = Form.useWatch('userId', formRef);

  const userFormOptions =
    users?.map((user) => (
      <Select.Option key={user.id} value={user.id?.toString()}>
        {`${user.firstName} ${user.lastName}`}
      </Select.Option>
    )) || [];
  userFormOptions.unshift(
    <Select.Option key="new" value="new" style={{ borderBottom: '1px solid lightGrey', borderRadius: 0 }}>
      + Add New Racer
    </Select.Option>,
  );

  return (
    <Form
      form={formRef}
      layout="vertical"
      name="raceForm"
      validateMessages={{
        required: 'Required',
        pattern: { mismatch: 'Invalid format' },
        string: { min: 'Must be 2 chars', max: 'Invalid format' },
        number: { max: '' },
      }}
      initialValues={{
        userId: null,
        firstName: '',
        lastName: '',
        minutes: '',
        seconds: '',
        raceName: '',
        distance: null,
        date: new Date(),
      }}
      onFinish={({ date, raceName, hours, minutes, seconds, userId, firstName, lastName, distance }: FormValues) => {
        const newRace: Race = {
          raceDate: date,
          raceName,
          distanceInMeters: parseFloat(distance),
          effectiveDistanceInmeters: 1,
          effectiveTimeInSeconds: 1,
          timeInSeconds: raceTimeToSeconds({ hours, minutes, seconds }),
        };
        if (userId === 'new') {
          newRace.user = {
            firstName,
            lastName,
            userFullName: `${firstName} ${lastName}`,
          };
        } else {
          newRace.userId = parseInt(userId);
        }

        createRaceMutation(newRace);
        reset();
        handleClose();
      }}
    >
      <FormItem
        wrapperCol={{ span: 24 }}
        label="Name"
        name="userId"
        rules={[{ required: true }]}
        required={false}
        validateTrigger={['onBlur', 'onChange']}
      >
        <StyledSelect
          bordered={false}
          dropdownStyle={{
            borderRadius: 2,
          }}
          showSearch
          placeholder="Name"
          filterOption={(input, option) => {
            if (option?.value === 'new') {
              return true;
            }
            return (option?.children ?? '').toLowerCase().includes(input.toLowerCase());
          }}
        >
          {userFormOptions}
        </StyledSelect>
      </FormItem>
      {userId === 'new' && (
        <Row gutter={10}>
          <Col span={12}>
            <FormItem
              label="Name"
              name="firstName"
              id="lastName"
              rules={[{ required: userId === 'new' ? true : false }, { min: 2 }]}
              required={false}
              validateTrigger="onBlur"
            >
              <StyledInput placeholder="First Name" />
            </FormItem>
          </Col>

          <Col span={12}>
            <FormItem
              label=" "
              name="lastName"
              id="lastName"
              rules={[{ required: userId === 'new' ? true : false }, { min: 2 }]}
              required={false}
              validateTrigger="onBlur"
            >
              <StyledInput placeholder="Last Name" />
            </FormItem>
          </Col>
        </Row>
      )}

      <FormItem
        wrapperCol={{ span: 24 }}
        label="Distance"
        name="distance"
        rules={[{ required: true }]}
        required={false}
        validateTrigger={['onBlur', 'onChange']}
      >
        <StyledSelect
          bordered={false}
          dropdownStyle={{
            borderRadius: 2,
          }}
          placeholder="Distance"
          options={DISTANCE_OPTIONS}
        />
      </FormItem>

      <FormItem
        label="Race Name"
        name="raceName"
        rules={[{ required: true }, { min: 2 }]}
        required={false}
        validateTrigger="onBlur"
      >
        <StyledInput type="text" placeholder="Seltzer Summer 5k" />
      </FormItem>
      <FormItem label="Date" name="date" rules={[{ required: true }]} required={false} validateTrigger="onBlur">
        <StyledDatePicker format={'MM-DD-YYYY'} />
      </FormItem>
      <Row gutter={0} align="bottom" wrap={false}>
        <Col>
          <FormItem
            label="Race Time"
            name="hours"
            id="hours"
            rules={[{ pattern: new RegExp(/^[1-9]?[0-9]$/) }]}
            required={false}
            validateTrigger="onBlur"
          >
            <StyledInput placeholder="Hours" type="number" />
          </FormItem>
        </Col>
        <Col style={{ marginBottom: 20, textAlign: 'center', fontSize: 18 }}>:</Col>
        <Col>
          <FormItem
            name="minutes"
            id="minutes"
            rules={[{ required: true }, { pattern: new RegExp(/^[1-9]?[0-9]$/) }]}
            required={false}
            validateTrigger="onBlur"
          >
            <StyledInput placeholder="Mins" type="number" />
          </FormItem>
        </Col>
        <Col style={{ marginBottom: 20, textAlign: 'center', fontSize: 18 }}>:</Col>
        <Col>
          <FormItem
            label=" "
            name="seconds"
            id="seconds"
            rules={[{ required: true }, { pattern: new RegExp(/^[0-5]?[0-9]$/) }]}
            required={false}
            validateTrigger="onBlur"
          >
            <StyledInput placeholder="Secs" type="number" />
          </FormItem>
        </Col>
      </Row>
      <Row justify="end">
        <Button style={{ margin: '20px 20px 0 0' }} onClick={handleClose}>
          Cancel
        </Button>
        <Button style={{ marginTop: '20px' }} type="primary" htmlType="submit">
          Submit
        </Button>
      </Row>
    </Form>
  );
};

export default RaceForm;
