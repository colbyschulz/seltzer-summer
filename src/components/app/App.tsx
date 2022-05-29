import { Field, FieldProps, Form, Formik, FormikProps } from 'formik';
import React, { FC, useMemo, useRef, useState } from 'react';
import * as Yup from 'yup';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { createRecord, getRecords } from '../../reactQuery/api';
import { queryKeys } from '../../reactQuery/queryKeys';
import { DistanceOption, TableRecord } from '../../types';
// import RecordTable from '../recordTable/RecordTable';
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
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
import { Column, useTable } from 'react-table';
import { RecordTableWrapper, StyledTableCell } from '../recordTable/recordTable.css';
import ArrowRight from '../../assets/images/arrow-right.png';

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
  const [isOpen, setIsOpen] = useState(false);
  const [activeName, setActiveName] = useState('');
  const formikRef = useRef(null);

  const { data: records = [], isLoading } = useQuery(queryKeys.records, () => getRecords());
  const { mutate: createRecordMutation, isLoading: createRecordLoading } = useMutation(createRecord, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.records);
    },
  });

  const normalizedData = records.reduce((accum, { fields: { name, distance, time, date, raceName } }) => {
    const timeInSeconds = time
      .split(':')
      .reduce((accum, time, index) => (index === 0 ? accum + Number(time) * 60 : accum + Number(time)), 0);
    if (!accum[name]) {
      accum[name] = [{ name, distance, time: timeInSeconds, date, raceName }];
    } else {
      accum[name].push({ name, distance, time: timeInSeconds, date, raceName });
    }
    return accum;
  }, {} as { [key: string]: { name: string; distance: string; time: number; raceName: string; date: string }[] });

  const enhancedData = useMemo(
    () =>
      Object.keys(normalizedData).map((name) => {
        const raceArray = normalizedData[name];
        const raceArrayMutable = [...raceArray];
        const sortedByDate = raceArrayMutable.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const baseRace = sortedByDate.splice(0, 1)[0];

        const fastestRemainingRace = raceArrayMutable.find(
          (race) => race.time === Math.min(...raceArrayMutable.map((race) => race.time)),
        );

        const deltaInSeconds = fastestRemainingRace?.time - baseRace.time || 0;
        const isFaster = deltaInSeconds.toString().includes('-');
        const minutes = Math.floor(Math.abs(deltaInSeconds) / 60).toString();
        const seconds = (Math.abs(deltaInSeconds) % 60).toLocaleString('en-US', {
          minimumIntegerDigits: 2,
          useGrouping: false,
        });

        return {
          name,
          numRaces: raceArray.length.toString(),
          delta: `${isFaster ? '-' : ''}${minutes}:${seconds}`,
          deltaInSeconds,
        };
      }),
    [records],
  );

  const data = useMemo(
    () =>
      enhancedData
        .sort((a, b) => a.deltaInSeconds - b.deltaInSeconds)
        .map((record, i) => ({
          name: record.name,
          position: (i + 1).toString(),
          numRaces: record.numRaces,
          delta: record.delta,
          test: '',
        })),
    [records],
  );

  const modalData = useMemo(
    () =>
      normalizedData[activeName]
        ?.map(({ name, date, raceName, time, distance }) => {
          const minutes = Math.floor(Math.abs(time) / 60).toString();
          const seconds = (Math.abs(time) % 60).toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false,
          });
          return {
            name,
            date: new Date(date).toLocaleDateString('en-US'),
            raceName,
            time: `${minutes}:${seconds}`,
            distance,
          };
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [],
    [records, activeName],
  );

  const modalcolumns: Array<Column<{ date: string; name: string; raceName: string; distance: string; time: string }>> =
    useMemo(
      () => [
        {
          Header: 'Date',
          accessor: 'date',
        },
        {
          Header: 'Name',
          accessor: 'name',
        },
        {
          Header: 'Race',
          accessor: 'raceName',
        },
        {
          Header: 'Time',
          accessor: 'time',
        },
      ],
      [],
    );

  const columns: Array<Column<{ position: string; name: string; numRaces: string; delta: string; test: string }>> =
    useMemo(
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
          Header: 'Baseline Delta',
          accessor: 'delta',
        },
        {
          Header: 'Detail',
          accessor: 'test',
          Cell: () => <img src={ArrowRight} width={20} alt="Arrow" />,
        },
      ],
      [],
    );

  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  const {
    getTableProps: getModalTableProps,
    headerGroups: modalHeaderGroups,
    rows: modalRows,
    prepareRow: modalPrepareRow,
  } = useTable({
    columns: modalcolumns,
    data: modalData,
  });

  return (
    <AppWrapper>
      <StyledButton color="primary" onClick={() => setIsModalOpen(true)}>
        Add Race
      </StyledButton>
      <RecordTableWrapper>
        <MaUTable {...getTableProps()} stickyHeader padding="none">
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow key={headerGroup.getHeaderGroupProps().key} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableCell style={{ padding: '10px' }} key={column.getHeaderProps().key} {...column.getHeaderProps()}>
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
                    setActiveName(row.original.name);
                    setIsOpen(true);
                  }}
                >
                  {row.cells.map((cell) => {
                    const cellColor =
                      cell.column.Header === 'Baseline Delta'
                        ? cell.value.includes('-')
                          ? 'green'
                          : cell.value === '0:00'
                          ? 'black'
                          : '#D30703'
                        : 'black';
                    return (
                      <StyledTableCell
                        style={{ color: cellColor, padding: '10px' }}
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
      <Modal header="Races" showModal={isOpen} onClose={() => setIsOpen(false)}>
        <MaUTable {...getModalTableProps()} padding="none">
          <TableHead>
            {modalHeaderGroups.map((headerGroup) => (
              <TableRow key={headerGroup.getHeaderGroupProps().key} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableCell style={{ padding: '10px' }} key={column.getHeaderProps().key} {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {modalRows.map((row, i) => {
              modalPrepareRow(row);
              return (
                <TableRow key={row.getRowProps().key} {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <StyledTableCell
                        style={{ padding: '10px' }}
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
      </Modal>
    </AppWrapper>
  );
};

export default App;
