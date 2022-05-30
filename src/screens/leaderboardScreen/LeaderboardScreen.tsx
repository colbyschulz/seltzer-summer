import { Field, FieldProps, Form, Formik } from 'formik';
import React, { FC, useMemo, useRef } from 'react';
import * as Yup from 'yup';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { createRecord, getRecords } from '../../reactQuery/api';
import { queryKeys } from '../../reactQuery/queryKeys';
import { TableRecord } from '../../types';
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {
  LeaderboardScreenWrapper,
  FormWrapper,
  Input,
  InputLabel,
  InputWrapper,
  ModalContent,
  RecordTableWrapper,
  StyledButton,
  StyledDatePicker,
  StyledTableCell,
} from './leaderboardScreen.css';
import Modal from '../../components/modal/Modal';
import { Column, useTable } from 'react-table';
import ArrowRight from '../../assets/images/arrow-right.svg';
import { racesByNameId, raceTimeToSeconds } from '../../utils';
import { useNavigate } from 'react-router-dom';

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

const App: FC = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const formikRef = useRef(null);
  const { data: records = [] } = useQuery(queryKeys.records, () => getRecords());
  const { mutate: createRecordMutation } = useMutation(createRecord, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.records);
    },
  });

  const dataNormalizedById = useMemo(() => racesByNameId(records), [records]);

  const leaderboardData = useMemo(() => {
    const enhancedData = Object.keys(dataNormalizedById).map((nameId) => {
      const raceArray = dataNormalizedById[nameId];
      const raceArrayMutable = [...raceArray];
      const sortedByDate = raceArrayMutable.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const baseRace = sortedByDate.splice(0, 1)[0];
      const fastestRemainingRace = raceArrayMutable.find(
        (race) => race.time === Math.min(...raceArrayMutable.map((race) => race.time)),
      );

      const deltaAsPercentage = ((fastestRemainingRace?.time - baseRace.time) / baseRace.time) * 100 || 0;

      return {
        nameId,
        name: baseRace.name,
        numRaces: raceArray.length.toString(),
        deltaAsPercentage,
      };
    });

    return enhancedData
      .sort((a, b) => a.deltaAsPercentage - b.deltaAsPercentage)
      .map(({ name, numRaces, deltaAsPercentage, nameId }, i) => ({
        nameId,
        name,
        position: (i + 1).toString(),
        numRaces,
        delta: deltaAsPercentage === 0 ? `${deltaAsPercentage}%` : `${deltaAsPercentage.toFixed(2)}%`,
        arrow: '',
      }));
  }, [records]);

  const leaderboardColumns: Array<
    Column<{ position: string; name: string; numRaces: string; delta: string; nameId: string; arrow: string }>
  > = useMemo(
    () => [
      {
        Header: 'Pos',
        accessor: 'position',
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Races',
        accessor: 'numRaces',
      },
      {
        Header: 'Progress',
        accessor: 'delta',
      },
      {
        Cell: () => <img style={{ alignSelf: 'center', display: 'flex' }} src={ArrowRight} width={20} alt="Arrow" />,
        accessor: 'arrow',
      },
    ],
    [],
  );

  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns: leaderboardColumns,
    data: leaderboardData,
  });

  return (
    <LeaderboardScreenWrapper>
      <StyledButton color="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: '20px' }}>
        Add Race
      </StyledButton>
      <RecordTableWrapper>
        <MaUTable {...getTableProps()} stickyHeader padding="none">
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow key={headerGroup.getHeaderGroupProps().key} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableCell style={{ padding: '12px' }} key={column.getHeaderProps().key} {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <TableRow
                  key={row.getRowProps().key}
                  {...row.getRowProps()}
                  onClick={() => {
                    navigate(`/${row.original.nameId}`);
                  }}
                >
                  {row.cells.map((cell) => {
                    const cellColor =
                      cell.column.Header === 'Progress'
                        ? cell.value.includes('-')
                          ? 'green'
                          : cell.value === '0%'
                          ? 'black'
                          : '#D30703'
                        : 'black';
                    return (
                      <StyledTableCell
                        style={{ color: cellColor, padding: '12px 8px', overflowWrap: 'break-word' }}
                        key={cell.getCellProps().key}
                        {...cell.getCellProps()}
                      >
                        {cell.render('Cell')}
                      </StyledTableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </MaUTable>
      </RecordTableWrapper>
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
              raceName: '',
              date: '',
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
                              placeholder="5k Ultra Marathon"
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
                          <div>:</div>
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
    </LeaderboardScreenWrapper>
  );
};

export default App;
