import React, { useMemo } from 'react';
import { Column, useTable } from 'react-table';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';

import { calcPaceDifference, racesByNameId, secondsToPace } from '../../utils';
import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';
import colors from '../../colors';
import RaceDetailChart from '../../components/raceDetailChart/RaceDetailChart';
import { useRecords } from '../../api/records';
import Card from '../../components/card/Card';
import { DetailScreenWrapper, DetailTableWrapper, MetricLabel, MetricValue } from './raceDetailScreen.css';
import { StyledTableCell } from '../leaderboardScreen/leaderboardScreen.css';
import { Table, Tbody, Th, THead, Tr } from '../../components/table/table.css';

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

  const dataNormalizedById = useMemo(() => racesByNameId(records), [records]);
  const raceArray = (nameId && dataNormalizedById[nameId]) || [];
  const detailsName = raceArray[0]?.name || '';
  const breadcrumbsconfig = [
    { route: '/', display: 'Leaderboard' },
    { route: null, display: detailsName },
  ];
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
      date: format(dateString, 'M/dd'),
      raceName,
      time: `${minutes}:${seconds}`,
    };
  };

  const formatedAndSortedRowData = useMemo(() => {
    if (!rowData.length || !raceArray.length) {
      return [];
    }
    rowData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const data = rowData.map(formatRowData);
    return data;
  }, [records]);

  const detailColumns: Array<Column<FormattedRowData>> = useMemo(
    () => [
      {
        Header: 'Date',
        accessor: 'date',
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
    getTableProps: getRaceDetailTableProps,
    headerGroups: raceDetailHeaderGroups,
    rows: raceDetailRows,
    prepareRow: raceDetailPrepareRow,
  } = useTable({
    columns: detailColumns,
    data: formatedAndSortedRowData,
  });

  return (
    <DetailScreenWrapper>
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0 20px 10px 20px' }}>
        <Breadcrumbs config={breadcrumbsconfig} />
      </div>

      <Card style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <div style={{ marginBottom: '5px' }}>
          <MetricLabel>Baseline Pace: </MetricLabel>
          <MetricValue>{basePace}</MetricValue>
        </div>

        <div>
          <MetricLabel>Best Effort Pace: </MetricLabel>
          <MetricValue>{bestEffortPace ? bestEffortPace : basePace}</MetricValue>
          <MetricValue color={baseRace?.time < mutableMinusBaseSortedByTime[0]?.time ? colors.red : colors.green}>
            {bestEffortPace
              ? ` (${baseRace?.time < mutableMinusBaseSortedByTime[0]?.time ? '' : '-'}${paceDifference})`
              : ''}
          </MetricValue>
        </div>
      </Card>

      <Card style={{ padding: '10px 12px 0 10px' }}>
        <RaceDetailChart />
      </Card>

      <DetailTableWrapper>
        <Table {...getRaceDetailTableProps()} cellSpacing="0" cellPadding="0" width="100%">
          <THead>
            {raceDetailHeaderGroups.map((headerGroup) => {
              const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();
              return (
                <Tr key={key} {...restHeaderGroupProps}>
                  {headerGroup.headers.map((column) => {
                    const { key, ...restHeaderProps } = column.getHeaderProps();
                    return (
                      <Th
                        key={key}
                        style={{
                          textAlign: 'left',
                        }}
                        {...restHeaderProps}
                      >
                        {column.render('Header')}
                      </Th>
                    );
                  })}
                </Tr>
              );
            })}
          </THead>
          <Tbody>
            {records &&
              raceDetailRows.map((row) => {
                raceDetailPrepareRow(row);
                const { key, ...restRowProps } = row.getRowProps();
                const backgroundColor = colors.transparentWhite;
                const color =
                  row.index === 0
                    ? colors.black
                    : row.original.isBestEffort
                    ? row.original.isBestEffortBetterThanBaseline
                      ? colors.green
                      : colors.red
                    : colors.grey;
                return (
                  <Tr key={key} {...restRowProps} style={{ backgroundColor }}>
                    {row.cells.map((cell) => {
                      const { key, ...restCellProps } = cell.getCellProps();

                      const raceNameExtras: any =
                        cell.column.id === 'raceName'
                          ? {
                              textAlign: 'left',
                              whiteSpace: 'nowrap',
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              maxWidth: '95px',
                            }
                          : {};
                      return (
                        <StyledTableCell
                          style={{
                            borderBottom: '1px solid',
                            borderColor: colors.tan,
                            padding: '12px 8px',
                            overflowWrap: 'break-word',
                            color,
                            ...raceNameExtras,
                          }}
                          key={key}
                          {...restCellProps}
                        >
                          {cell.render('Cell')}
                        </StyledTableCell>
                      );
                    })}
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </DetailTableWrapper>
    </DetailScreenWrapper>
  );
};

export default DetailScreen;
