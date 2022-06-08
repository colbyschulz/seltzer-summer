import React, { FC, useMemo, useState } from 'react';
import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {
  LeaderboardScreenWrapper,
  LeaderboardTableWrapper,
  StyledButton,
  StyledTableCell,
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

const App: FC = () => {
  const { data: records = [] } = useRecords();
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
                        style={{
                          padding: '12px 8px',
                          backgroundColor: colors.tan,
                          textAlign:
                            column.id === 'arrow' || column.id === 'numRaces' || column.id === 'position'
                              ? 'center'
                              : 'left',
                        }}
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
                </TableRow>
              );
            })}
          </TableBody>
        </MaUTable>
      </LeaderboardTableWrapper>
    </LeaderboardScreenWrapper>
  );
};

export default App;
