import { Field, FieldProps, Form, Formik } from 'formik';
import React, { FC, useMemo, useRef, useState } from 'react';
import * as Yup from 'yup';
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
  LeaderboardTableWrapper,
  StyledButton,
  StyledTableCell,
} from './leaderboardScreen.css';
import Modal from '../../components/modal/Modal';
import { Column, useTable } from 'react-table';
import ArrowRight from '../../assets/images/arrow-right.svg';
import { racesByNameId, raceTimeToSeconds } from '../../utils';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';
import { useRecords, useCreateRecord } from '../../api/records';
import LeaderboardChart from '../../components/leaderboardChart/LeaderboardChart';
import colors from '../../colors';
import { format } from 'date-fns';
import Card from '../../components/card/Card';

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
  const { data: records = [] } = useRecords();
  const { mutate: createRecordMutation } = useCreateRecord();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [activeDataKey, setActiveDataKey] = useState<string>('');
  const formikRef = useRef<any>(null);

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
      const deltaAsPercentage =
        (fastestRemainingRace?.time && ((fastestRemainingRace?.time - baseRace.time) / baseRace.time) * 100) || 0;

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
        Header: 'Delta',
        accessor: 'delta',
      },
      {
        Header: 'Details',
        Cell: () => (
          <StyledButton
            style={{
              marginBottom: 0,
              width: 'auto',
              padding: '7px',
              minHeight: 'unset',
              maxWidth: '80px',
              backgroundColor: colors.tan,
            }}
          >
            <img
              style={{ alignSelf: 'center', display: 'flex', width: '12px' }}
              src={ArrowRight}
              width={12}
              alt="Arrow"
            />
          </StyledButton>
        ),
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          margin: '0 20px 3px 20px',
          alignItems: 'flex-start',
        }}
      >
        <Breadcrumbs config={[{ route: null, display: 'Leaderboard' }]} />
        <StyledButton
          color="primary"
          onClick={() => setIsModalOpen(true)}
          style={{ backgroundColor: colors.tan, height: '36px' }}
        >
          Add Race
        </StyledButton>
      </div>

      <Card style={{ padding: '10px 12px 0 10px' }}>
        <LeaderboardChart activeDataKey={activeDataKey} setActiveDataKey={setActiveDataKey} />
      </Card>

      <LeaderboardTableWrapper>
        <MaUTable {...getTableProps()} stickyHeader padding="none">
          <TableHead>
            {headerGroups.map((headerGroup) => {
              const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();
              return (
                <TableRow key={key} {...restHeaderGroupProps}>
                  {headerGroup.headers.map((column) => {
                    const { key, ...restHeaderProps } = column.getHeaderProps();
                    return (
                      <TableCell
                        key={key}
                        style={{ padding: '12px 8px', backgroundColor: colors.tan }}
                        {...restHeaderProps}
                      >
                        {column.render('Header')}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              prepareRow(row);
              const { key, ...restRowProps } = row.getRowProps();

              const backgroundColor = row.original.name === activeDataKey ? 'rgb(193, 160, 109, 0.2)' : 'transparent';
              return (
                <TableRow
                  key={key}
                  {...restRowProps}
                  style={{ cursor: 'pointer', backgroundColor, borderColor: colors.tan }}
                >
                  {row.cells.map((cell) => {
                    const { key, ...restCellProps } = cell.getCellProps();
                    const cellColor =
                      cell.column.Header === 'Delta'
                        ? cell.value.includes('-')
                          ? colors.green
                          : cell.value === '0%'
                          ? '#131313'
                          : colors.red
                        : '#131313';
                    return (
                      <StyledTableCell
                        key={key}
                        onClick={() => {
                          if (cell.column.id === 'arrow') {
                            navigate(`/${row.original.nameId}`);
                          } else {
                            setActiveDataKey(row.original.name);
                          }
                        }}
                        style={{
                          borderColor: colors.grey,
                          color: cellColor,
                          padding: '12px 8px',
                          overflowWrap: 'break-word',
                          display: 'table-cell',
                          textAlign: cell.column.id === 'arrow' ? 'center' : 'left',
                        }}
                        {...restCellProps}
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
      </LeaderboardTableWrapper>
      <Modal
        showModal={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
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
              setIsModalOpen(false);
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
    </LeaderboardScreenWrapper>
  );
};

export default App;
