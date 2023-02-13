import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

import {
  calcPaceDifference,
  getInitialRaceFormValues,
  metersToDisplayNameMap,
  raceTimeToSeconds,
  secondsToPace,
  secondsToRaceTime,
} from '../../utils';
import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';
import colors from '../../colors';
import RaceDetailChart from '../../components/raceDetailChart/RaceDetailChart';
import Card from '../../components/card/Card';
import { DetailScreenWrapper, DetailTableWrapper, MetricLabel, MetricValue } from './raceDetailScreen.css';
import { StyledTableCell } from '../leaderboardScreen/leaderboardScreen.css';
import { Table, Tbody, Th, THead, Tr } from '../../components/table/table.css';
import { Race } from '../../types';
import { useUser } from '../../api/users';
import SettingsPopover from './SettingsPopover';
import { Form } from 'antd';
import RaceForm from '../../components/raceForm/RaceForm';
import { useDeleteRace, useUpdateRace } from '../../api/races';
import Button from '../../components/button/Button';
import Modal from '../../components/modal/Modal';

const columnHelper = createColumnHelper<DetailTableData>();

interface DetailTableData extends Race {
  isBestEffort?: boolean;
  isBaseline?: boolean;
  isBestEffortBetterThanBaseline?: boolean;
  raceTime?: string;
  effectiveRaceTime?: string;
  edit?: string;
}

const DetailScreen = () => {
  const { userId } = useParams();
  const [activeEditId, setActiveEditId] = useState<number | null>(null);
  const [activeDeleteId, setActiveDeleteId] = useState<number | null>(null);
  const { mutate: updateRaceMutation } = useUpdateRace();
  const { mutate: deleteRaceMutation } = useDeleteRace();
  const { data: user } = useUser(userId);
  const raceArray = user?.races ?? [];
  const [formRef] = Form.useForm();
  const activeRaceToBeEdited = !!activeEditId ? raceArray.find((race) => race.id === activeEditId) : null;
  const userFullName = user?.userFullName ?? 'Racer';
  const breadcrumbsconfig = [
    { route: '/', display: 'Leaderboard' },
    { route: null, display: userFullName },
  ];

  const columns = [
    columnHelper.accessor('raceDate', {
      cell: (info) => info.getValue(),
      header: () => 'Date',
    }),
    columnHelper.accessor('raceName', {
      cell: (info) => info.getValue(),
      header: () => 'Race',
    }),
    columnHelper.accessor('raceTime', {
      header: () => 'Time',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('distanceInMeters', {
      header: () => 'Dist.',
      cell: (info) => {
        const meters = info.getValue();
        return metersToDisplayNameMap[meters] ?? meters;
      },
    }),
    columnHelper.accessor('effectiveRaceTime', {
      header: () => 'Eff. 5k',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('edit', {
      header: () => '',
      cell: ({
        row: {
          original: { id },
        },
      }) => {
        return <SettingsPopover setActiveEditId={setActiveEditId} setActiveDeleteId={setActiveDeleteId} raceId={id} />;
      },
    }),
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
  const remainingRacesSortedByTime = mutableSortedByDate.sort(
    (a, b) => (a.effectiveTimeInSeconds ?? 0) - (b.effectiveTimeInSeconds ?? 0),
  );
  const bestEffortRace = remainingRacesSortedByTime[0];
  if (bestEffortRace) {
    bestEffortRace.isBestEffort = true;

    if ((bestEffortRace.effectiveTimeInSeconds ?? 0) < (baseRace.effectiveTimeInSeconds ?? 0)) {
      bestEffortRace.isBestEffortBetterThanBaseline = true;
    }
  }

  // combine enhanced races back together
  const raceData = raceArrayMutable.length ? [enhancedBaseRace, ...remainingRacesSortedByTime] : [enhancedBaseRace];

  const basePace = secondsToPace(baseRace?.effectiveTimeInSeconds);
  const bestEffortPace = secondsToPace(remainingRacesSortedByTime[0]?.effectiveTimeInSeconds);
  const paceDifference = calcPaceDifference(bestEffortPace, basePace);

  const formatedAndSortedTableData = useMemo(() => {
    if (!raceData.length || !raceArray.length) {
      return [];
    }
    raceData.sort((a, b) => new Date(a.raceDate).getTime() - new Date(b.raceDate).getTime());

    const data = raceData.map((race) => {
      const { raceDate, effectiveTimeInSeconds, timeInSeconds } = race;
      const raceTime = secondsToRaceTime(timeInSeconds);
      const effectiveRaceTime = secondsToRaceTime(effectiveTimeInSeconds);

      return {
        ...race,
        userFullName: userFullName,
        raceDate: format(new Date(raceDate), 'M/dd'),
        raceTime: raceTime,
        effectiveRaceTime: effectiveRaceTime,
      };
    });

    return data;
  }, [user]);

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
          <MetricLabel>Baseline Effective 5k Pace: </MetricLabel>
          <MetricValue>{basePace}</MetricValue>
        </div>

        <div>
          <MetricLabel>Best Effective 5k Pace: </MetricLabel>
          <MetricValue>{bestEffortPace ? bestEffortPace : basePace}</MetricValue>
          <MetricValue
            color={
              (baseRace?.effectiveTimeInSeconds ?? 0) < (remainingRacesSortedByTime[0]?.effectiveTimeInSeconds ?? 0)
                ? colors.red
                : colors.green
            }
          >
            {bestEffortPace
              ? ` (${
                  (baseRace?.effectiveTimeInSeconds ?? 0) < (remainingRacesSortedByTime[0]?.effectiveTimeInSeconds ?? 0)
                    ? ''
                    : '-'
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
                      zIndex: 2,
                    }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </Th>
                ))}
              </Tr>
            ))}
          </THead>
          <Tbody>
            {table.getRowModel().rows.map((row) => {
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
                            maxWidth: '65px',
                          }
                        : {};

                    return (
                      <StyledTableCell
                        style={{
                          padding: '6px 5px',
                          overflowWrap: 'break-word',
                          fontSize: '12px',
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

      <Modal
        showModal={!!activeEditId}
        onClose={() => {
          setActiveEditId(null);
          formRef.resetFields();
        }}
      >
        <RaceForm
          editMode
          initialValues={getInitialRaceFormValues({ race: activeRaceToBeEdited, user })}
          formRef={formRef}
          handleClose={() => {
            setActiveEditId(null);
            formRef.resetFields();
          }}
          handleSubmit={(formValues) => {
            const { date, raceName, hours, minutes, seconds, userId, firstName, lastName, distance } = formValues;
            const updatedRace = {
              ...activeRaceToBeEdited,
              raceDate: date.toString(),
              raceName,
              distanceInMeters: distance ? parseFloat(distance) : 0,

              timeInSeconds: raceTimeToSeconds({ hours, minutes, seconds }),
            };
            if (userId === 'new') {
              updatedRace.user = {
                firstName,
                lastName,
                userFullName: `${firstName} ${lastName}`,
              };
            } else {
              updatedRace.userId = userId ? parseInt(userId) : 0;
            }

            updateRaceMutation(updatedRace);
          }}
        />
      </Modal>
      <Modal
        header="Are you sure?"
        showModal={!!activeDeleteId}
        onClose={() => {
          setActiveDeleteId(null);
          formRef.resetFields();
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          <Button
            style={{ margin: '20px 20px 0 0' }}
            onClick={() => {
              setActiveDeleteId(null);
            }}
          >
            Cancel
          </Button>
          <Button style={{ marginTop: '20px' }} type="primary" onClick={() => deleteRaceMutation(activeDeleteId)}>
            {"Put 'er down"}
          </Button>
        </div>
      </Modal>
    </DetailScreenWrapper>
  );
};

export default DetailScreen;
