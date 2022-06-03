import { TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import React, { useMemo } from 'react';
import { Column, useTable } from 'react-table';
import { calcPaceDifference, racesByNameId, secondsToPace } from '../../utils';
import { StyledTableCell } from '../leaderboardScreen/leaderboardScreen.css';
import { DetailScreenWrapper, MetricLabel, Metrics, MetricValue } from './detailScreen.css';
import MaUTable from '@material-ui/core/Table';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';
import colors from '../../colors';
import LineChart from '../../components/lineChart/LineChart';
import { useRecords } from '../../api/records';

interface EnhancedTableRecordField {
  name?: string;
  time?: number;
  isBestEffort?: boolean;
  isBaseline?: boolean;
  isBestEffortBetterThanBaseline?: boolean;
  raceName?: string;
  date?: string;
}

interface RowData {
  name: string;
  time: string;
  isBestEffort: boolean;
  isBaseline: boolean;
  isBestEffortBetterThanBaseline: boolean;
  raceName: string;
  date: string;
}

const DetailScreen = () => {
  const { data: records = [] } = useRecords();
  const { nameId } = useParams();
  const breadcrumbsconfig = [
    { route: '/', display: 'Leaderboard' },
    { route: null, display: 'Detail' },
  ];

  const dataNormalizedById = useMemo(() => racesByNameId(records), [records]);
  const raceArray = dataNormalizedById?.[nameId];
  const raceArrayMutable = raceArray ? [...raceArray] : [];
  const sortedByDate = raceArrayMutable.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const baseRace = sortedByDate.splice(0, 1)[0];

  const enhancedBaseRace: EnhancedTableRecordField = {
    ...baseRace,
    isBaseline: true,
  };

  const remainingRacesSortedBytime: EnhancedTableRecordField[] = sortedByDate.sort((a, b) => a.time - b.time);
  if (remainingRacesSortedBytime[0]) {
    remainingRacesSortedBytime[0].isBestEffort = true;
  }

  if (remainingRacesSortedBytime[0] && remainingRacesSortedBytime[0].time < baseRace.time) {
    remainingRacesSortedBytime[0].isBestEffortBetterThanBaseline = true;
  }

  const enhancedRaceArray = [enhancedBaseRace, ...remainingRacesSortedBytime];

  const basePace = secondsToPace(baseRace?.time);
  const bestEffortPace = secondsToPace(remainingRacesSortedBytime[0]?.time);
  const paceDifference = calcPaceDifference(bestEffortPace, basePace);

  const createTableDataEntry = ({ name, raceName, time, date, ...rest }: EnhancedTableRecordField) => {
    const minutes = Math.floor(Math.abs(time) / 60).toString();
    const seconds = (Math.abs(time) % 60).toLocaleString('US', {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    const parsedDate = date && date.split('-');

    const dateString =
      parsedDate && new Date(parseInt(parsedDate[0]), parseInt(parsedDate[1]) - 1, parseInt(parsedDate[2]));

    return {
      ...rest,
      name,
      date: dateString?.toLocaleDateString('US') ?? '',
      raceName,
      time: `${minutes}:${seconds}`,
    };
  };

  const detailModalData = useMemo(() => {
    const data = enhancedRaceArray.map(createTableDataEntry);
    data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return data;
  }, [records]);

  const detailColumns: Array<Column<RowData>> = useMemo(
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

  const {
    getTableProps: getModalTableProps,
    headerGroups: modalHeaderGroups,
    rows: modalRows,
    prepareRow: modalPrepareRow,
  } = useTable({
    columns: detailColumns,
    data: detailModalData,
  });

  return (
    <DetailScreenWrapper>
      <Breadcrumbs config={breadcrumbsconfig} />

      <Metrics>
        <div style={{ marginBottom: '5px' }}>
          <MetricLabel>Baseline Pace: </MetricLabel>
          <MetricValue>{basePace}</MetricValue>
        </div>

        <div style={{ marginBottom: '5px' }}>
          <MetricLabel>Best Effort Pace: </MetricLabel>
          <MetricValue>{bestEffortPace ? bestEffortPace : basePace}</MetricValue>
          <MetricValue color={baseRace?.time < remainingRacesSortedBytime[0]?.time ? colors.red : colors.green}>
            {bestEffortPace
              ? ` (${baseRace?.time < remainingRacesSortedBytime[0]?.time ? '' : '-'}${paceDifference})`
              : ''}
          </MetricValue>
        </div>
      </Metrics>

      <LineChart />

      <MaUTable {...getModalTableProps()} padding="none" stickyHeader>
        <TableHead>
          {modalHeaderGroups.map((headerGroup) => (
            <TableRow key={headerGroup.getHeaderGroupProps().key} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableCell
                  style={{ padding: '12px 8px' }}
                  key={column.getHeaderProps().key}
                  {...column.getHeaderProps()}
                >
                  {column.render('Header')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {records &&
            modalRows.map((row) => {
              modalPrepareRow(row);
              const color =
                row.index === 0
                  ? 'black'
                  : row.original.isBestEffort
                  ? row.original.isBestEffortBetterThanBaseline
                    ? colors.green
                    : colors.red
                  : colors.grey;
              return (
                <TableRow key={row.getRowProps().key} {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <StyledTableCell
                        style={{ padding: '12px', overflowWrap: 'break-word', color }}
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
    </DetailScreenWrapper>
  );
};

export default DetailScreen;
