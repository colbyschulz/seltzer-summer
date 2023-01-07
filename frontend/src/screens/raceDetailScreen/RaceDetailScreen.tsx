import React, { useMemo } from 'react';
// import { Column, useTable } from 'react-table';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';

import { calcPaceDifference, racesByUserId, secondsToPace } from '../../utils';
import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';
import colors from '../../colors';
import RaceDetailChart from '../../components/raceDetailChart/RaceDetailChart';
import { useRaces } from '../../api/races';
import Card from '../../components/card/Card';
import { DetailScreenWrapper, DetailTableWrapper, MetricLabel, MetricValue } from './raceDetailScreen.css';
import { StyledTableCell } from '../leaderboardScreen/leaderboardScreen.css';
import { Table, Tbody, Th, THead, Tr } from '../../components/table/table.css';
import { Race } from '../../types';

interface RowData extends Race {
  isBestEffort?: boolean;
  isBaseline?: boolean;
  isBestEffortBetterThanBaseline?: boolean;
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
  const { data: races = [] } = useRaces();
  const { nameId } = useParams();

  const dataNormalizedById = useMemo(() => racesByUserId(races), [races]);
  const raceArray = (nameId && dataNormalizedById[nameId]) || [];
  const detailsName = raceArray[0]?.raceName || '';
  const breadcrumbsconfig = [
    { route: '/', display: 'Leaderboard' },
    { route: null, display: detailsName },
  ];
  const raceArrayMutable = [...raceArray];
  const mutableSortedByDate: RowData[] = raceArrayMutable.sort(
    (a, b) => new Date(a.raceDate).getTime() - new Date(b.raceDate).getTime(),
  );
  const baseRace = mutableSortedByDate.splice(0, 1)[0];

  const enhancedBaseRace = {
    ...baseRace,
    isBaseline: true,
  };

  const mutableMinusBaseSortedByTime = mutableSortedByDate.sort((a, b) => a.timeInSeconds - b.timeInSeconds);
  if (mutableMinusBaseSortedByTime[0]) {
    mutableMinusBaseSortedByTime[0].isBestEffort = true;
  }

  if (mutableMinusBaseSortedByTime[0] && mutableMinusBaseSortedByTime[0].timeInSeconds < baseRace.timeInSeconds) {
    mutableMinusBaseSortedByTime[0].isBestEffortBetterThanBaseline = true;
  }

  const rowData = [enhancedBaseRace, ...mutableMinusBaseSortedByTime];

  const basePace = secondsToPace(baseRace?.timeInSeconds);
  const bestEffortPace = secondsToPace(mutableMinusBaseSortedByTime[0]?.timeInSeconds);
  const paceDifference = calcPaceDifference(bestEffortPace, basePace);

  const formatRowData = ({ user, raceName, timeInSeconds, raceDate, ...rest }: RowData) => {
    const minutes = Math.floor(Math.abs(timeInSeconds) / 60).toString();
    const seconds = (Math.abs(timeInSeconds) % 60).toLocaleString('US', {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });

    // const parsedDate = raceDate.split('-');
    // const dateString = new Date(parseInt(parsedDate[0]), parseInt(parsedDate[1]) - 1, parseInt(parsedDate[2]));
    const dateString = new Date(raceDate);

    return {
      ...rest,
      name: user?.firstName || 'unknown"',
      date: format(dateString, 'M/dd'),
      raceName,
      time: `${minutes}:${seconds}`,
    };
  };

  const formatedAndSortedRowData = useMemo(() => {
    if (!rowData.length || !raceArray.length) {
      return [];
    }
    rowData.sort((a, b) => new Date(a.raceDate).getTime() - new Date(b.raceDate).getTime());
    const data = rowData.map(formatRowData);
    return data;
  }, [races]);

  // const detailColumns: Array<Column<FormattedRowData>> = useMemo(
  //   () => [
  //     {
  //       Header: 'Date',
  //       accessor: 'date',
  //     },
  //     {
  //       Header: 'Race',
  //       accessor: 'raceName',
  //     },
  //     {
  //       Header: 'Time',
  //       accessor: 'time',
  //     },
  //   ],
  //   [],
  // );

  // const {
  //   getTableProps: getRaceDetailTableProps,
  //   headerGroups: raceDetailHeaderGroups,
  //   rows: raceDetailRows,
  //   prepareRow: raceDetailPrepareRow,
  // } = useTable({
  //   columns: detailColumns,
  //   data: formatedAndSortedRowData,
  // });

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
          <MetricValue
            color={baseRace?.timeInSeconds < mutableMinusBaseSortedByTime[0]?.timeInSeconds ? colors.red : colors.green}
          >
            {bestEffortPace
              ? ` (${
                  baseRace?.timeInSeconds < mutableMinusBaseSortedByTime[0]?.timeInSeconds ? '' : '-'
                }${paceDifference})`
              : ''}
          </MetricValue>
        </div>
      </Card>

      <Card style={{ padding: '10px 12px 0 10px' }}>
        <RaceDetailChart />
      </Card>

      <DetailTableWrapper>
        {/* <Table {...getRaceDetailTableProps()} cellSpacing="0" cellPadding="0" width="100%">
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
            {races &&
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
        </Table> */}
      </DetailTableWrapper>
    </DetailScreenWrapper>
  );
};

export default DetailScreen;
