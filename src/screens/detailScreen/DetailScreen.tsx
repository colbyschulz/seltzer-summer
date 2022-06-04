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
import RaceComparisonChart from '../../components/raceComparisonChart/RaceComparisonChart';
import { useRecords } from '../../api/records';

interface RowData {
  name: string;
  time: number;
  isBestEffort?: boolean;
  isBaseline?: boolean;
  isBestEffortBetterThanBaseline?: boolean;
  raceName: string;
  date: string;
}
interface FormattedRowData {
  name: string;
  time: string;
  isBestEffort?: boolean;
  isBaseline?: boolean;
  isBestEffortBetterThanBaseline?: boolean;
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

  const dataNormalizedById = racesByNameId(records);
  const raceArray = (nameId && dataNormalizedById[nameId]) || [];
  const raceArrayMutable = [...raceArray];
  const mutableSortedByDate = raceArrayMutable.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  ) as RowData[];
  const baseRace = mutableSortedByDate.splice(0, 1)[0];

  const enhancedBaseRace = {
    ...baseRace,
    isBaseline: true,
  };

  const mutableMinusBaseSortedByTime = mutableSortedByDate.sort((a, b) => a.time - b.time);
  if (mutableMinusBaseSortedByTime[0]) {
    mutableMinusBaseSortedByTime[0].isBestEffort = true;
  }

  if (mutableMinusBaseSortedByTime[0] && mutableMinusBaseSortedByTime[0].time < baseRace.time) {
    mutableMinusBaseSortedByTime[0].isBestEffortBetterThanBaseline = true;
  }

  const rowData = [enhancedBaseRace, ...mutableMinusBaseSortedByTime];

  const basePace = secondsToPace(baseRace?.time);
  const bestEffortPace = secondsToPace(mutableMinusBaseSortedByTime[0]?.time);
  const paceDifference = calcPaceDifference(bestEffortPace, basePace);

  const formatRowData = ({ name, raceName, time, date, ...rest }: RowData) => {
    const minutes = Math.floor(Math.abs(time) / 60).toString();
    const seconds = (Math.abs(time) % 60).toLocaleString('US', {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });

    const parsedDate = date.split('-');

    const dateString = new Date(parseInt(parsedDate[0]), parseInt(parsedDate[1]) - 1, parseInt(parsedDate[2]));

    return {
      ...rest,
      name,
      date: dateString.toLocaleDateString('US'),
      raceName,
      time: `${minutes}:${seconds}`,
    };
  };

  const formatedAndSortedRowData = useMemo(() => {
    console.log(records);

    const data = records.length ? rowData.map(formatRowData) : [];
    data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return data;
  }, [records]);

  const detailColumns: Array<Column<FormattedRowData>> = useMemo(
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
    data: formatedAndSortedRowData,
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
          <MetricValue color={baseRace?.time < mutableMinusBaseSortedByTime[0]?.time ? colors.red : colors.green}>
            {bestEffortPace
              ? ` (${baseRace?.time < mutableMinusBaseSortedByTime[0]?.time ? '' : '-'}${paceDifference})`
              : ''}
          </MetricValue>
        </div>
      </Metrics>

      <RaceComparisonChart />

      <MaUTable {...getModalTableProps()} padding="none" stickyHeader style={{ marginTop: '20px' }}>
        <TableHead>
          {modalHeaderGroups.map((headerGroup) => {
            const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();
            return (
              <TableRow key={key} {...restHeaderGroupProps}>
                {headerGroup.headers.map((column) => {
                  const { key, ...restColumnProps } = column.getHeaderProps();
                  return (
                    <TableCell style={{ padding: '12px 8px' }} key={key} {...restColumnProps}>
                      {column.render('Header')}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableHead>
        <TableBody>
          {records &&
            modalRows.map((row) => {
              modalPrepareRow(row);
              const { key, ...restRowProps } = row.getRowProps();
              const color =
                row.index === 0
                  ? 'black'
                  : row.original.isBestEffort
                  ? row.original.isBestEffortBetterThanBaseline
                    ? colors.green
                    : colors.red
                  : colors.grey;
              return (
                <TableRow key={key} {...restRowProps}>
                  {row.cells.map((cell) => {
                    const { key, ...restCellProps } = cell.getCellProps();
                    return (
                      <StyledTableCell
                        style={{ padding: '12px', overflowWrap: 'break-word', color }}
                        key={key}
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
    </DetailScreenWrapper>
  );
};

export default DetailScreen;
