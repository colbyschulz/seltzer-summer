import React, { useRef } from 'react';
import * as Yup from 'yup';
import GlobalCSS from '../../globalStyles.css';
import Seltzer from '../../assets/images/seltzer.png';
import { Route, Routes, useLocation } from 'react-router-dom';
import DetailScreen from '../../screens/detailScreen/DetailScreen';
import LeaderboardScreen from '../../screens/leaderboardScreen/LeaderboardScreen';
import {
  AboutLabel,
  AboutText,
  AboutWrapper,
  FooterText,
  FooterWrapper,
  FormWrapper,
  HeaderImage,
  HeaderWrapper,
  Input,
  InputLabel,
  InputWrapper,
  StyledButton,
} from './App.css';
import SignButton from '../../components/signButton/SignButton';
import Modal from '../modal/Modal';
import { format } from 'date-fns';
import { raceTimeToSeconds } from '../../utils';
import { Formik, Form, Field, FieldProps } from 'formik';
import { useCreateRecord } from '../../api/records';
import { TableRecord } from '../../types';
import colors from '../../colors';

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

const App = () => {
  const { mutate: createRecordMutation } = useCreateRecord();
  const [isRaceModalOpen, setIsRaceModalOpen] = React.useState(false);
  const formikRef = useRef<any>(null);

  const [isAboutModalOpen, setIsAboutModalOpen] = React.useState(false);
  const location = useLocation();

  return (
    <>
      <GlobalCSS />
      <HeaderWrapper>
        <HeaderImage src={Seltzer} />
        {location.pathname === '/' && (
          <SignButton
            transparent
            text="About"
            onClick={() => setIsAboutModalOpen(true)}
            rotation={-2}
            height={50}
            right={120}
            rightText={135}
            bottom={-47}
            bottomText={-46}
          />
        )}
        {location.pathname === '/' && (
          <SignButton
            text="Add Race"
            onClick={() => setIsRaceModalOpen(true)}
            rotation={2}
            height={50}
            rightText={27}
            bottom={-47}
            bottomText={-46}
            right={24}
          />
        )}
      </HeaderWrapper>

      <Routes>
        <Route path="/" element={<LeaderboardScreen />} />
        <Route path="/:nameId" element={<DetailScreen />} />
      </Routes>

      <FooterWrapper>
        <FooterText>colbyschulz@gmail.com</FooterText>
      </FooterWrapper>
      <Modal
        showModal={isAboutModalOpen}
        onClose={() => {
          setIsAboutModalOpen(false);
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: '13px' }}>
          <h3 style={{ marginTop: 0, fontSize: '16px' }}>Summer of Speed 5k Challenge</h3>
          <AboutWrapper>
            <AboutLabel>Objective:</AboutLabel>
            <AboutText>
              Starting with a recent baseline 5k, make the most progress lowering your 5k time through the summer.
            </AboutText>
          </AboutWrapper>

          <AboutWrapper>
            <AboutLabel>Rules:</AboutLabel>
            <AboutText>Entries must be a 5k effort</AboutText>
          </AboutWrapper>

          <AboutWrapper>
            <AboutLabel>Measurement:</AboutLabel>
            <AboutText>
              The leaderboard is based on percentages relative to baseline effort. So, as you get faster, each second
              counts for more.
            </AboutText>
            <AboutText>{`e.g  16:00 to 15:50 (-1.04%) vs 20:00 to 19:50(-.83%)`} </AboutText>
          </AboutWrapper>
        </div>
      </Modal>
      <Modal
        showModal={isRaceModalOpen}
        onClose={() => {
          setIsRaceModalOpen(false);
          if (formikRef) {
            formikRef.current?.resetForm();
          }
        }}
      >
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
              setIsRaceModalOpen(false);
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
                        <InputLabel
                          error={(touched.minutes && !!errors.minutes) || (touched.seconds && !!errors.seconds)}
                        >
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
      </Modal>
    </>
  );
};

export default App;
