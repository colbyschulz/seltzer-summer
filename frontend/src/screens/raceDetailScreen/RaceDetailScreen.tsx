import React, { useMemo } from 'react';
// import { Column, useTable } from 'react-table';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';

import { calcPaceDifference, secondsToPace } from '../../utils';
import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';
import colors from '../../colors';
import RaceDetailChart from '../../components/raceDetailChart/RaceDetailChart';
import Card from '../../components/card/Card';
import { DetailScreenWrapper, DetailTableWrapper, MetricLabel, MetricValue } from './raceDetailScreen.css';
import { StyledTableCell } from '../leaderboardScreen/leaderboardScreen.css';
import { Table, Tbody, Th, THead, Tr } from '../../components/table/table.css';
import { Race } from '../../types';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useUser } from '../../api/users';

interface DetailTableData extends Race {
  isBestEffort?: boolean;
  isBaseline?: boolean;
  isBestEffortBetterThanBaseline?: boolean;
  time?: string;
}
const columnHelper = createColumnHelper<DetailTableData>();
const columns = [
  columnHelper.accessor('raceDate', {
    cell: (info) => info.getValue(),
    header: () => 'Date',
  }),
  columnHelper.accessor('raceName', {
    cell: (info) => info.getValue(),
    header: () => 'Race Name',
  }),
  columnHelper.accessor('time', {
    header: () => 'Time',
    cell: (info) => info.getValue(),
  }),
];

const DetailScreen = () => {
  const { userId } = useParams();
  console.log('userId', userId);

  const { data: user } = useUser(userId);
  console.log('user', user);

  const raceArray = user?.races ?? [];
  console.log('race Array', raceArray);

  const userFullName = user?.userFullName ?? 'Racer';
  const breadcrumbsconfig = [
    { route: '/', display: 'Leaderboard' },
    { route: null, display: userFullName },
  ];
  const raceArrayMutable = [...raceArray] as DetailTableData[];

  // remove base race from array
  const mutableSortedByDate = raceArrayMutable.sort(
    (a, b) => new Date(a.raceDate).getTime() - new Date(b.raceDate).getTime(),
  );
  const baseRace = mutableSortedByDate.splice(0, 1)[0];
  // Add flag for base race
  const enhancedBaseRace = {
    ...baseRace,
    isBaseline: true,
  };

  // Add flag for best effort
  const remainingRacesSortedByTime = mutableSortedByDate.sort((a, b) => a.timeInSeconds - b.timeInSeconds);
  const bestEffortRace = remainingRacesSortedByTime[0];
  if (bestEffortRace) {
    bestEffortRace.isBestEffort = true;

    if (bestEffortRace.timeInSeconds < baseRace.timeInSeconds) {
      bestEffortRace.isBestEffortBetterThanBaseline = true;
    }
  }

  // combine enhanced races back together
  const raceData = raceArrayMutable.length
    ? [enhancedBaseRace, ...remainingRacesSortedByTime]
    : [...remainingRacesSortedByTime];

  const basePace = secondsToPace(baseRace?.timeInSeconds);
  const bestEffortPace = secondsToPace(remainingRacesSortedByTime[0]?.timeInSeconds);
  const paceDifference = calcPaceDifference(bestEffortPace, basePace);

  const formatTableData = ({ user, raceDate, timeInSeconds, ...rest }: DetailTableData) => {
    const minutes = Math.floor(Math.abs(timeInSeconds) / 60).toString();
    const seconds = (Math.abs(timeInSeconds) % 60).toLocaleString('US', {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    const dateString = new Date(raceDate);

    return {
      ...rest,
      userFullName: userFullName,
      raceDate: format(dateString, 'M/dd'),
      time: `${minutes}:${seconds}`,
      timeInSeconds,
    };
  };

  const formatedAndSortedTableData = useMemo(() => {
    if (!raceData.length || !raceArray.length) {
      return [];
    }
    raceData.sort((a, b) => new Date(a.raceDate).getTime() - new Date(b.raceDate).getTime());
    const data = raceData.map(formatTableData);
    return data;
  }, [user]);
  console.log(formatedAndSortedTableData);

  const table = useReactTable({
    data: formatedAndSortedTableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
          <MetricValue
            color={baseRace?.timeInSeconds < remainingRacesSortedByTime[0]?.timeInSeconds ? colors.red : colors.green}
          >
            {bestEffortPace
              ? ` (${
                  baseRace?.timeInSeconds < remainingRacesSortedByTime[0]?.timeInSeconds ? '' : '-'
                }${paceDifference})`
              : ''}
          </MetricValue>
        </div>
      </Card>

      <Card style={{ padding: '10px 12px 0 10px' }}>
        <RaceDetailChart />
      </Card>

      <DetailTableWrapper>
        <Table cellSpacing="0" cellPadding="0" width="100%">
          <THead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th
                    key={header.id}
                    style={{
                      textAlign: 'left',
                    }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </Th>
                ))}
              </Tr>
            ))}
          </THead>
          <Tbody>
            {table.getRowModel().rows.map((row, i) => {
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
                <Tr style={{ backgroundColor }} key={row.id}>
                  {row.getVisibleCells().map((cell) => {
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
                        key={cell.id}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
