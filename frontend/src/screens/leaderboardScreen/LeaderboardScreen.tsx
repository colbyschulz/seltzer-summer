import React, { FC, useMemo, useState } from 'react';
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { Form } from 'antd';

import ArrowRight from '../../assets/images/arrow-right.svg';
import { racesByUserId, raceTimeToSeconds } from '../../utils';
import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';
import { useCreateRace, useRaces } from '../../api/races';
import LeaderboardChart from '../../components/leaderboardChart/LeaderboardChart';
import colors from '../../colors';
import Card from '../../components/card/Card';
import RaceForm from '../../components/raceForm/RaceForm';
import Button from '../../components/button/Button';
import {
  AboutHeader,
  AboutLabel,
  AboutText,
  AboutWrapper,
  HeaderControls,
  LeaderboardScreenWrapper,
  LeaderboardTableWrapper,
  StyledTableCell,
} from './leaderboardScreen.css';
import { Table, Tbody, Th, THead, Tr } from '../../components/table/table.css';
import { Race } from '../../types';
import Modal from '../../components/modal/Modal';

type LeaderboardData = {
  position: string;
  userFullName: string;
  userId?: number;
  numRaces: string;
  delta: string;
  arrow: string;
};
const columnHelper = createColumnHelper<LeaderboardData>();
const columns = [
  columnHelper.accessor('position', {
    cell: (info) => info.getValue(),
    header: () => 'Pos',
  }),
  columnHelper.accessor('userFullName', {
    cell: (info) => info.getValue(),
    header: () => 'Name',
  }),
  columnHelper.accessor('numRaces', {
    header: () => 'Races',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('delta', {
    header: () => 'Delta',
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor('arrow', {
    header: () => 'Details',
    cell: () => (
      <Button
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
          style={{ alignSelf: 'center', display: 'flex', width: '12px', padding: 0 }}
          src={ArrowRight}
          width={12}
          alt="Arrow"
        />
      </Button>
    ),
  }),
];

const LeaderboardScreen: FC = () => {
  const { data: races = [] } = useRaces();
  const { mutate: createRaceMutation } = useCreateRace();
  const navigate = useNavigate();
  const [isRaceModalOpen, setIsRaceModalOpen] = React.useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = React.useState(false);
  const [activeDataKey, setActiveDataKey] = useState<number | null>(null);
  const [formRef] = Form.useForm();

  const dataNormalizedByUserId = useMemo(() => racesByUserId(races), [races]);

  const leaderboardData = useMemo(() => {
    const enhancedData = Object.keys(dataNormalizedByUserId).map((userId) => {
      const userRaceArray = dataNormalizedByUserId[userId];
      const userRaceArrayMutable = [...userRaceArray];
      const sortedByDate = userRaceArrayMutable.sort(
        (a, b) => new Date(a.raceDate).getTime() - new Date(b.raceDate).getTime(),
      );
      // Users first race by which all comparisons are made
      const baseRace = sortedByDate.splice(0, 1)[0];
      // Users fastest race not including base race
      const fastestRemainingRace = userRaceArrayMutable.find(
        (race) =>
          race.effectiveTimeInSeconds ===
          Math.min(...userRaceArrayMutable.map((race) => race.effectiveTimeInSeconds ?? 0)),
      );
      const deltaAsPercentage =
        (fastestRemainingRace?.effectiveTimeInSeconds &&
          ((fastestRemainingRace?.effectiveTimeInSeconds - (baseRace.effectiveTimeInSeconds ?? 0)) /
            (baseRace.effectiveTimeInSeconds ?? 0)) *
            100) ||
        0;

      return {
        userFullName: baseRace?.user?.userFullName ?? 'userName',
        numRaces: userRaceArray.length.toString(),
        deltaAsPercentage,
        userId: baseRace?.userId,
      };
    });

    return enhancedData
      .sort((a, b) => a.deltaAsPercentage - b.deltaAsPercentage)
      .map(({ numRaces, deltaAsPercentage, userFullName, userId }, i) => ({
        position: (i + 1).toString(),
        userFullName,
        userId,
        numRaces,
        delta: deltaAsPercentage === 0 ? `${deltaAsPercentage}%` : `${deltaAsPercentage.toFixed(2)}%`,
        arrow: '',
      }));
  }, [races]);

  const table = useReactTable({
    data: leaderboardData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <LeaderboardScreenWrapper>
      <HeaderControls>
        <Breadcrumbs config={[{ route: null, display: 'Leaderboard' }]} />
        <div style={{ display: 'flex' }}>
          <Button
            style={{ marginRight: 15, borderColor: colors.black, color: colors.black }}
            onClick={() => setIsAboutModalOpen(true)}
          >
            About
          </Button>
          <Button type="primary" onClick={() => setIsRaceModalOpen(true)}>
            Add Race
          </Button>
        </div>
      </HeaderControls>

      <Card style={{ padding: '10px 12px 0 10px' }}>
        <LeaderboardChart activeDataKey={activeDataKey} setActiveDataKey={setActiveDataKey} />
      </Card>

      <LeaderboardTableWrapper>
        <Table cellSpacing="0" cellPadding="0" width="100%">
          <THead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th
                    key={header.id}
                    style={{
                      textAlign:
                        header.id === 'arrow' || header.id === 'numRaces' || header.id === 'position'
                          ? 'center'
                          : 'left',
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
              let rowColor;
              if (i === 0) {
                rowColor = 'rgb(220, 188, 15, 0.15)';
              } else if (i === 1) {
                rowColor = 'rgb(192, 192, 192, 0.15)';
              } else if (i === 2) {
                rowColor = 'rgb(205, 127, 15, 0.15)';
              } else {
                rowColor = 'transparent';
              }

              const backgroundColor = row.original.userId === activeDataKey ? 'rgb(65, 41, 5, 0.2)' : rowColor;

              return (
                <Tr
                  key={row.id}
                  style={{ cursor: 'pointer', backgroundColor, borderBottom: '1px solid', borderColor: colors.tan }}
                >
                  {row.getVisibleCells().map((cell) => {
                    const cellValue = cell.getValue() as string;

                    const cellColor =
                      cell.column.id === 'delta'
                        ? cellValue.includes('-')
                          ? colors.green
                          : cellValue === '0%'
                          ? colors.black
                          : colors.red
                        : colors.black;

                    return (
                      <StyledTableCell
                        key={cell.id}
                        onClick={() => {
                          if (cell.column.id === 'arrow') {
                            navigate(`/${row.original.userId}`);
                          } else {
                            setActiveDataKey(row.original.userId ?? null);
                          }
                        }}
                        style={{
                          color: cellColor,
                          padding: '8px',
                          overflowWrap: 'break-word',
                          display: 'table-cell',
                          textAlign:
                            cell.column.id === 'arrow' || cell.column.id === 'numRaces' || cell.column.id === 'position'
                              ? 'center'
                              : 'left',
                        }}
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
      </LeaderboardTableWrapper>
      <Modal
        showModal={isRaceModalOpen}
        onClose={() => {
          setIsRaceModalOpen(false);
          formRef.resetFields();
        }}
      >
        <RaceForm
          formRef={formRef}
          handleClose={() => {
            setIsRaceModalOpen(false);
            formRef.resetFields();
          }}
          handleSubmit={(formValues) => {
            const { date, raceName, hours, minutes, seconds, userId, firstName, lastName, distance } = formValues;
            const newRace: Race = {
              raceDate: date.toString(),
              raceName,
              distanceInMeters: distance ? parseFloat(distance) : 0,
              timeInSeconds: raceTimeToSeconds({ hours, minutes, seconds }),
            };
            if (userId === 'new') {
              newRace.user = {
                firstName,
                lastName,
                userFullName: `${firstName} ${lastName}`,
              };
            } else {
              newRace.userId = userId ? parseInt(userId) : 0;
            }
            createRaceMutation(newRace);
          }}
        />
      </Modal>

      <Modal
        showModal={isAboutModalOpen}
        onClose={() => {
          setIsAboutModalOpen(false);
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: '13px' }}>
          <AboutHeader>Summer of Speed</AboutHeader>
          <AboutWrapper>
            <AboutLabel>Objective:</AboutLabel>
            <AboutText>
              Starting with a recent baseline race, make the most progress lowering your effective 5k time throughout
              the summer.
            </AboutText>
          </AboutWrapper>

          <AboutWrapper>
            <AboutLabel>Rules:</AboutLabel>
            <AboutText>Must be a measured race. Track time trials are fine.</AboutText>
          </AboutWrapper>

          <AboutWrapper>
            <AboutLabel>Measurement:</AboutLabel>
            <AboutText>{`Effective 5k time is calculated via Pete Reigel's formula from his work 'Athletic Records and Human Endurance' published in American Scientist.`}</AboutText>
          </AboutWrapper>

          <AboutWrapper>
            <AboutText>{`Formula: t2 = t1 * (d2 / d1)^1.06`}</AboutText>
          </AboutWrapper>

          <AboutWrapper>
            <AboutText>
              The leaderboard is based on percentages relative to baseline effort. So, as you get faster, each second
              counts for more.
            </AboutText>
            <AboutText>{`e.g  16:00 to 15:50 (-1.04%) vs 20:00 to 19:50(-.83%)`} </AboutText>
          </AboutWrapper>
          <Button
            key="ok"
            type="primary"
            onClick={() => {
              setIsAboutModalOpen(false);
            }}
            style={{ marginTop: 20, alignSelf: 'flex-end' }}
          >
            Cool
          </Button>
        </div>
      </Modal>
    </LeaderboardScreenWrapper>
  );
};

export default LeaderboardScreen;
