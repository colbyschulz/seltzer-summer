import React, { FC, useMemo, useRef, useState } from 'react';

import {
  AboutLabel,
  AboutText,
  AboutWrapper,
  LeaderboardScreenWrapper,
  LeaderboardTableWrapper,
  StyledButton,
  StyledTableCell,
  TransparentButton,
} from './leaderboardScreen.css';
import { Column, useTable } from 'react-table';
import ArrowRight from '../../assets/images/arrow-right.svg';
import { racesByNameId } from '../../utils';
import { useNavigate } from 'react-router-dom';
import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';
import { useRecords } from '../../api/records';
import LeaderboardChart from '../../components/leaderboardChart/LeaderboardChart';
import colors from '../../colors';
import Card from '../../components/card/Card';

import RaceForm from '../../components/raceForm/RaceForm';
import Modal from '../../components/modal/Modal';

const App: FC = () => {
  const { data: records = [] } = useRecords();
  const [isRaceModalOpen, setIsRaceModalOpen] = React.useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = React.useState(false);

  const formikRef = useRef<any>(null);
  const navigate = useNavigate();

  const [activeDataKey, setActiveDataKey] = useState<string>('');

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
              style={{ alignSelf: 'center', display: 'flex', width: '12px', padding: 0 }}
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
          margin: '0 20px 7px 20px',
          alignItems: 'flex-start',
        }}
      >
        <Breadcrumbs config={[{ route: null, display: 'Leaderboard' }]} />
        <div style={{ display: 'flex' }}>
          <TransparentButton onClick={() => setIsAboutModalOpen(true)}>About</TransparentButton>
          <StyledButton onClick={() => setIsRaceModalOpen(true)}>Add Race</StyledButton>
        </div>
      </div>

      <Card style={{ padding: '10px 12px 0 10px' }}>
        <LeaderboardChart activeDataKey={activeDataKey} setActiveDataKey={setActiveDataKey} />
      </Card>

      <LeaderboardTableWrapper>
        <table
          {...getTableProps()}
          cellSpacing="0"
          cellPadding="0"
          width="100%"
          style={{ borderCollapse: 'collapse', overflowX: 'hidden', fontSize: '13px', fontWeight: 500 }}
        >
          <thead>
            {headerGroups.map((headerGroup) => {
              const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();
              return (
                <tr key={key} {...restHeaderGroupProps}>
                  {headerGroup.headers.map((column) => {
                    const { key, ...restHeaderProps } = column.getHeaderProps();
                    return (
                      <th
                        key={key}
                        style={{
                          padding: '12px 5px',
                          position: 'sticky',
                          top: 0,
                          backgroundColor: colors.tan,
                          textAlign:
                            column.id === 'arrow' || column.id === 'numRaces' || column.id === 'position'
                              ? 'center'
                              : 'left',
                        }}
                        {...restHeaderProps}
                      >
                        {column.render('Header')}
                      </th>
                    );
                  })}
                </tr>
              );
            })}
          </thead>
          <tbody>
            {rows.map((row, i) => {
              prepareRow(row);
              const { key, ...restRowProps } = row.getRowProps();

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
              const backgroundColor = row.original.name === activeDataKey ? 'rgb(65, 41, 5, 0.2)' : rowColor;
              return (
                <tr
                  key={key}
                  {...restRowProps}
                  style={{ cursor: 'pointer', backgroundColor, borderBottom: '1px solid', borderColor: colors.tan }}
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
                          textAlign:
                            cell.column.id === 'arrow' || cell.column.id === 'numRaces' || cell.column.id === 'position'
                              ? 'center'
                              : 'left',
                        }}
                        {...restCellProps}
                      >
                        {cell.render('Cell')}
                      </StyledTableCell>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </LeaderboardTableWrapper>
      <Modal
        showModal={isRaceModalOpen}
        onClose={() => {
          setIsRaceModalOpen(false);
          if (formikRef) {
            formikRef.current?.resetForm();
          }
        }}
      >
        <RaceForm formikRef={formikRef} handleClose={() => setIsRaceModalOpen(false)} />
      </Modal>
      <Modal
        showModal={isAboutModalOpen}
        onClose={() => {
          setIsAboutModalOpen(false);
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: '13px' }}>
          <h3 style={{ marginTop: 0, fontSize: '16px' }}>Summer of Speed 5k Challenge</h3>
          <AboutWrapper>
            <AboutLabel>Objective:</AboutLabel>
            <AboutText>
              Starting with a recent baseline 5k, make the most progress lowering your 5k time through the summer.
            </AboutText>
          </AboutWrapper>

          <AboutWrapper>
            <AboutLabel>Rules:</AboutLabel>
            <AboutText>Entries must be a 5k effort.</AboutText>
          </AboutWrapper>

          <AboutWrapper>
            <AboutLabel>Measurement:</AboutLabel>
            <AboutText>
              The leaderboard is based on percentages relative to baseline effort. So, as you get faster, each second
              counts for more.
            </AboutText>
            <AboutText>{`e.g  16:00 to 15:50 (-1.04%) vs 20:00 to 19:50(-.83%)`} </AboutText>
          </AboutWrapper>
        </div>
      </Modal>
    </LeaderboardScreenWrapper>
  );
};

export default App;
