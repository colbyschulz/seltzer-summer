import React, { FC } from 'react';
import * as Yup from 'yup';

import { format } from 'date-fns';
import { Field, FieldProps, Form, Formik } from 'formik';
import { TableRecord } from '../../types';
import { raceTimeToSeconds } from '../../utils';
import { FormWrapper, Input, InputLabel, InputWrapper, StyledButton } from './raceForm.css';
import { useCreateRecord } from '../../api/records';
import colors from '../../colors';

interface RaceFormProps {
  formikRef: any;
  handleClose: () => void;
}

interface FormValues {
  firstName: string;
  lastName: string;
  raceName: string;
  minutes: string;
  seconds: string;
  date: string;
}

const validationSchema = Yup.object().shape({
  firstName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
  lastName: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Required'),
  raceName: Yup.string().required('Required'),
  minutes: Yup.string()
    .required('Required')
    // .min(2)
    .max(2)
    .matches(/(1[0-9]|[2-5][0-9])/, ''),
  seconds: Yup.string()
    .required('Required')
    .max(2)
    .matches(/^[0-5]?[0-9]$/, ''),
  date: Yup.string().required('Required'),
});

const RaceForm: FC<RaceFormProps> = ({ formikRef, handleClose }) => {
  const { mutate: createRecordMutation } = useCreateRecord();

  return (
    <div style={{ display: 'flex' }}>
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          minutes: '',
          seconds: '',
          raceName: '',
          date: format(new Date(), 'yyyy-MM-dd'),
        }}
        innerRef={formikRef}
        validationSchema={validationSchema}
        onSubmit={({ date, raceName, firstName, lastName, minutes, seconds }: FormValues, { resetForm }) => {
          const recordValues: TableRecord = {
            fields: {
              date,
              raceName,
              name: `${firstName.trim()} ${lastName.trim()}`.toLowerCase(),
              distance: '5k',
              time: raceTimeToSeconds(minutes, seconds),
            },
          };
          createRecordMutation(recordValues);
          handleClose();
          resetForm();
        }}
      >
        {({ handleChange, errors, touched }) => {
          return (
            <Form>
              <FormWrapper>
                <div style={{ display: 'flex', width: '100%' }}>
                  <Field name="firstName" id="firstName">
                    {({ field, form: { touched, errors } }: FieldProps) => (
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
                    {({ field, form: { touched, errors } }: FieldProps) => (
                      <InputWrapper style={{ flex: 1 }}>
                        <InputLabel error={touched.lastName && !!errors.lastName} htmlFor="lastName">
                          Last Name
                        </InputLabel>
                        <Input
                          error={touched.lastName && !!errors.lastName}
                          type="text"
                          placeholder="Enthusiast"
                          {...field}
                        />
                      </InputWrapper>
                    )}
                  </Field>
                </div>

                <div style={{ display: 'flex', width: '100%' }}>
                  <Field name="raceName" id="raceName">
                    {({ field, form: { touched, errors } }: FieldProps) => (
                      <InputWrapper style={{ width: '100%' }}>
                        <InputLabel error={touched.raceName && !!errors.raceName} htmlFor="raceName">
                          Race Name
                        </InputLabel>
                        <Input
                          error={touched.raceName && !!errors.raceName}
                          type="text"
                          placeholder="Seltzer Summer 5k"
                          {...field}
                        />
                      </InputWrapper>
                    )}
                  </Field>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <Field name="date" id="date">
                    {({ field, form: { touched, errors } }: FieldProps) => (
                      <InputWrapper>
                        <InputLabel error={touched.date && !!errors.date} htmlFor="date">
                          Date
                        </InputLabel>
                        <Input
                          error={touched.date && !!errors.date}
                          id="date"
                          type="date"
                          {...field}
                          onChange={handleChange}
                        />
                      </InputWrapper>
                    )}
                  </Field>

                  <InputWrapper>
                    <InputLabel error={(touched.minutes && !!errors.minutes) || (touched.seconds && !!errors.seconds)}>
                      Time
                    </InputLabel>
                    <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                      <Field name="minutes" id="minutes">
                        {({ field, form: { touched, errors } }: FieldProps) => (
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
                      <div style={{ marginBottom: '20px' }}>:</div>
                      <Field name="seconds" id="seconds">
                        {({ field, form: { touched, errors } }: FieldProps) => (
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

                <StyledButton
                  style={{ alignSelf: 'center', marginTop: '20px', backgroundColor: colors.tan }}
                  type="submit"
                >
                  Submit
                </StyledButton>
              </FormWrapper>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default RaceForm;
