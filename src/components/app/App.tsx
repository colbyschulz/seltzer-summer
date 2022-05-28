import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import React, { FC, useRef } from 'react';
import * as Yup from 'yup';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { createRecord, getRecords } from '../../reactQuery/api';
import { queryKeys } from '../../reactQuery/queryKeys';
import { DistanceOption, TableRecord } from '../../types';
import RecordTable from '../recordTable/RecordTable';
import {
  AppWrapper,
  FormWrapper,
  Input,
  InputLabel,
  InputWrapper,
  ModalContent,
  StyledButton,
  StyledDatePicker,
} from './App.css';
import Modal from '../modal/Modal';

interface FormValues {
  firstName: string;
  lastName: string;
  raceName: string;
  minutes: string;
  seconds: string;
  distance: DistanceOption;
  date: string;
}

const validationSchema = Yup.object().shape({
  firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
  lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
  raceName: Yup.string().required('Required'),
  minutes: Yup.string()
    .required('Required')
    .max(2)
    .matches(/(1[0-9]|[2-5][0-9])/, ''),
  seconds: Yup.string()
    .required('Required')
    .max(2)
    .matches(/(0[0-9]|[1-5][0-9])/, ''),
  date: Yup.string().required('Required'),
});

const App: FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const formikRef = useRef(null);

  const { data: records, isLoading } = useQuery(queryKeys.records, () => getRecords());
  const { mutate: createRecordMutation, isLoading: createRecordLoading } = useMutation(createRecord, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.records);
    },
  });

  return (
    <AppWrapper>
      <StyledButton color="primary" onClick={() => setIsModalOpen(true)}>
        Add Race
      </StyledButton>
      <RecordTable records={records} />
      <Modal
        showModal={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          if (formikRef) {
            formikRef.current?.resetForm();
          }
        }}
      >
        <ModalContent>
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              minutes: '',
              seconds: '',
              distance: '',
              raceName: '',
              date: '',
            }}
            innerRef={formikRef}
            validationSchema={validationSchema}
            onSubmit={(values: FormValues, { resetForm }) => {
              const recordValues: TableRecord = {
                fields: {
                  date: values.date,
                  raceName: values.raceName,
                  name: `${values.firstName} ${values.lastName}`.toLowerCase(),
                  distance: values.distance || '5k',
                  time: `${values.minutes}:${values.seconds}`,
                },
              };
              createRecordMutation(recordValues);
              setIsModalOpen(false);
              resetForm();
            }}
          >
            {({ handleChange, errors, touched }) => {
              return (
                <Form>
                  <FormWrapper>
                    <div style={{ display: 'flex' }}>
                      <Field name="firstName" id="firstName">
                        {({ field, form: { touched, errors }, meta }: FieldProps) => (
                          <InputWrapper>
                            <InputLabel error={touched.firstName && !!errors.firstName} htmlFor="firstName">
                              First Name
                            </InputLabel>
                            <Input
                              type="text"
                              placeholder="Seltzer"
                              error={touched.firstName && !!errors.firstName}
                              {...field}
                            />
                          </InputWrapper>
                        )}
                      </Field>

                      <Field name="lastName" id="lastName">
                        {({ field, form: { touched, errors }, meta }: FieldProps) => (
                          <InputWrapper>
                            <InputLabel error={touched.lastName && !!errors.lastName} htmlFor="lastName">
                              Last Name
                            </InputLabel>
                            <Input
                              error={touched.lastName && !!errors.lastName}
                              type="text"
                              placeholder="Enthusiast"
                              {...field}
                            />
                            {/* {meta.touched && errors.firstName && <div>{errors.firstName}</div>} */}
                          </InputWrapper>
                        )}
                      </Field>
                    </div>

                    <div style={{ display: 'flex', width: '100%' }}>
                      <Field name="raceName" id="raceName">
                        {({ field, form: { touched, errors }, meta }: FieldProps) => (
                          <InputWrapper style={{ width: '100%' }}>
                            <InputLabel error={touched.raceName && !!errors.raceName} htmlFor="raceName">
                              Race Name
                            </InputLabel>
                            <Input
                              error={touched.raceName && !!errors.raceName}
                              type="text"
                              placeholder="5k Ultra Marathon"
                              {...field}
                            />
                          </InputWrapper>
                        )}
                      </Field>
                    </div>

                    {/* <InputWrapper style={{ alignSelf: 'flexStart' }}>
                    <InputLabel htmlFor="distance">Distance</InputLabel>
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
                  </InputWrapper> */}

                    <div style={{ display: 'flex', alignItems: 'baseline' }}>
                      <Field name="date" id="date">
                        {({ field, form: { touched, errors }, meta }: FieldProps) => (
                          <InputWrapper>
                            <InputLabel error={touched.date && !!errors.date} htmlFor="date">
                              Date
                            </InputLabel>
                            <StyledDatePicker
                              error={touched.date && !!errors.date}
                              id="date"
                              name="date"
                              type="date"
                              {...field}
                              onChange={handleChange}
                            />
                          </InputWrapper>
                        )}
                      </Field>

                      <InputWrapper>
                        <InputLabel
                          error={(touched.minutes && !!errors.minutes) || (touched.seconds && !!errors.seconds)}
                        >
                          Time
                        </InputLabel>
                        <div style={{ display: 'flex', alignItems: 'baseline' }}>
                          <Field name="minutes" id="minutes">
                            {({ field, form: { touched, errors }, meta }: FieldProps) => (
                              <>
                                <Input
                                  error={touched.minutes && !!errors.minutes}
                                  placeholder="Mins"
                                  type="number"
                                  {...field}
                                  style={{ width: '65px' }}
                                />
                              </>
                            )}
                          </Field>
                          <div>:</div>
                          <Field name="seconds" id="seconds">
                            {({ field, form: { touched, errors }, meta }: FieldProps) => (
                              <>
                                <Input
                                  error={touched.seconds && !!errors.seconds}
                                  placeholder="Secs"
                                  type="number"
                                  {...field}
                                  style={{ width: '100%' }}
                                />
                              </>
                            )}
                          </Field>
                        </div>
                      </InputWrapper>
                    </div>

                    <StyledButton style={{ alignSelf: 'center', marginTop: '30px' }} type="submit">
                      Submit
                    </StyledButton>
                  </FormWrapper>
                </Form>
              );
            }}
          </Formik>
        </ModalContent>
      </Modal>
    </AppWrapper>
  );
};

export default App;
