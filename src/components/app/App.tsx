import { Field, FieldProps, Form, Formik } from 'formik';
import React, { FC } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { createRecord, getRecords } from '../../reactQuery/api';
import { queryKeys } from '../../reactQuery/queryKeys';
import { DistanceOption, TableRecord } from '../../types';
import RecordTable from '../recordTable/RecordTable';
import Button from '@material-ui/core/Button';
import { AppWrapper, FormWrapper, Input, InputWrapper, Select } from './App.css';

interface FormValues {
  firstName: string;
  lastName: string;
  minutes: string;
  seconds: string;
  distance: DistanceOption;
}

const App: FC = () => {
  const queryClient = useQueryClient();
  const { data: records, isLoading } = useQuery(queryKeys.records, () => getRecords());
  const { mutate: createRecordMutation, isLoading: createRecordLoading } = useMutation(createRecord, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.records);
    },
  });

  return (
    <AppWrapper>
      <RecordTable records={records} />
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          minutes: '',
          seconds: '',
          distance: '',
        }}
        onSubmit={(values: FormValues, { resetForm }) => {
          const recordValues: TableRecord = {
            fields: {
              name: `${values.firstName} ${values.lastName}`,
              distance: values.distance || '5k',
              time: `${values.minutes}:${values.seconds}`,
            },
          };
          createRecordMutation(recordValues);
          resetForm();
        }}
      >
        {({ values, handleChange, handleBlur, handleSubmit }) => (
          <Form>
            <FormWrapper>
              {/* <div style={{ display: 'flex' }}> */}
              <Field name="firstName" id="firstName">
                {({
                  field, // { name, value, onChange, onBlur }
                  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                  meta,
                }: FieldProps) => (
                  <InputWrapper>
                    <label htmlFor="firstName">First Name</label>
                    <Input type="text" placeholder="Seltzer" {...field} />
                    {meta.touched && meta.error && <div>{meta.error}</div>}
                  </InputWrapper>
                )}
              </Field>

              <Field name="lastName" id="lastName">
                {({
                  field, // { name, value, onChange, onBlur }
                  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                  meta,
                }: FieldProps) => (
                  <InputWrapper>
                    <label htmlFor="lastName">Last Name</label>
                    <Input type="text" placeholder="Enthusiast" {...field} />
                    {meta.touched && meta.error && <div>{meta.error}</div>}
                  </InputWrapper>
                )}
              </Field>
              {/* </div> */}

              {/* <div style={{ display: 'flex' }}> */}
              <InputWrapper style={{ alignSelf: 'flexStart' }}>
                <label htmlFor="distance">Distance</label>
                <Select name="distance" id="distance" onChange={handleChange} value={values.distance}>
                  <option key="default" value=""></option>
                  <option key="1 mile" value="1 mile">
                    1 Mile
                  </option>
                  <option key="5k" value="5k">
                    5k
                  </option>
                  <option key="10k" value="10k">
                    10k
                  </option>
                </Select>
              </InputWrapper>

              <Field name="minutes" id="minutes">
                {({ field, form: { touched, errors }, meta }: FieldProps) => (
                  <InputWrapper>
                    <label htmlFor="minutes">Minutes</label>
                    <Input type="text" {...field} />
                    {meta.touched && meta.error && <div>{meta.error}</div>}
                  </InputWrapper>
                )}
              </Field>

              <Field name="seconds" id="seconds">
                {({ field, form: { touched, errors }, meta }: FieldProps) => (
                  <InputWrapper>
                    <label htmlFor="seconds">Seconds</label>
                    <Input type="text" {...field} />
                    {meta.touched && meta.error && <div>{meta.error}</div>}
                  </InputWrapper>
                )}
              </Field>
              {/* </div> */}

              <Button color="primary" type="submit">
                Submit
              </Button>
            </FormWrapper>
          </Form>
        )}
      </Formik>
    </AppWrapper>
  );
};

export default App;
