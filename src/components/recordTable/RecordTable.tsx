import React, { FC, useMemo, useState } from 'react';
import { TableRecord } from '../../types';

import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Modal from '../modal/Modal';
import { useTable, Column } from 'react-table';
import { RecordTableWrapper, StyledTableCell } from './recordTable.css';
import ArrowRight from '../../assets/images/arrow-right.png';

interface RecordTableProps {
  records?: TableRecord[];
}

const RecordTable: FC<RecordTableProps> = ({ records = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeName, setActiveName] = useState('');
  const normalizedData = records.reduce((accum, { fields: { name, distance, time, date, raceName } }) => {
    const timeInSeconds = time
      .split(':')
      .reduce((accum, time, index) => (index === 0 ? accum + Number(time) * 60 : accum + Number(time)), 0);
    if (!accum[name]) {
      accum[name] = [{ name, distance, time: timeInSeconds, date, raceName }];
    } else {
      accum[name].push({ name, distance, time: timeInSeconds, date, raceName });
    }
    return accum;
  }, {} as { [key: string]: { name: string; distance: string; time: number; raceName: string; date: string }[] });

  console.log(normalizedData);

  const enhancedData = useMemo(
    () =>
      Object.keys(normalizedData).map((name) => {
        const raceArray = normalizedData[name];
        const raceArrayMutable = [...raceArray];
        const sortedByDate = raceArrayMutable.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        const baseRace = sortedByDate.splice(0, 1)[0];

        const fastestRemainingRace = raceArrayMutable.find(() =>
          Math.min(...raceArrayMutable.map((race) => race.time)),
        );

        const deltaInSeconds = fastestRemainingRace?.time - baseRace.time || 0;
        const isFaster = deltaInSeconds.toString().includes('-');
        const minutes = Math.floor(Math.abs(deltaInSeconds) / 60).toString();
        const seconds = (Math.abs(deltaInSeconds) % 60).toLocaleString('en-US', {
          minimumIntegerDigits: 2,
          useGrouping: false,
        });

        return {
          name,
          numRaces: raceArray.length.toString(),
          delta: `${isFaster ? '-' : ''}${minutes}:${seconds}`,
          deltaInSeconds,
        };
      }),
    [records],
  );

  const data = useMemo(
    () =>
      enhancedData
        .sort((a, b) => a.deltaInSeconds - b.deltaInSeconds)
        .map((record, i) => ({
          name: record.name,
          position: (i + 1).toString(),
          numRaces: record.numRaces,
          delta: record.delta,
          test: '',
        })),
    [records],
  );

  const modalData = useMemo(
    () =>
      normalizedData[activeName]
        ?.map(({ name, date, raceName, time, distance }) => {
          const minutes = Math.floor(Math.abs(time) / 60).toString();
          const seconds = (Math.abs(time) % 60).toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false,
          });
          return {
            name,
            date: new Date(date).toLocaleDateString('en-US'),
            raceName,
            time: `${minutes}:${seconds}`,
            distance,
          };
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [],
    [records, activeName],
  );

  console.log(data, modalData, activeName);

  const modalcolumns: Array<Column<{ date: string; name: string; raceName: string; distance: string; time: string }>> =
    useMemo(
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

  const columns: Array<Column<{ position: string; name: string; numRaces: string; delta: string; test: string }>> =
    useMemo(
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
          Header: '',
          accessor: 'test',
          Cell: () => <img src={ArrowRight} width={20} alt="Arrow" />,
        },
      ],
      [],
    );

  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
  });

  const {
    getTableProps: getModalTableProps,
    headerGroups: modalHeaderGroups,
    rows: modalRows,
    prepareRow: modalPrepareRow,
  } = useTable({
    columns: modalcolumns,
    data: modalData,
  });

  return (
    <RecordTableWrapper>
      <MaUTable {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow key={headerGroup.getHeaderGroupProps().key} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableCell key={column.getHeaderProps().key} {...column.getHeaderProps()}>
                  {column.render('Header')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <TableRow
                key={row.getRowProps().key}
                {...row.getRowProps()}
                onClick={() => {
                  setActiveName(row.original.name);
                  setIsOpen(true);
                }}
              >
                {row.cells.map((cell) => {
                  const cellColor =
                    cell.column.Header === 'Delta'
                      ? cell.value.includes('-')
                        ? 'green'
                        : cell.value === '0:00'
                        ? 'black'
                        : '#D30703'
                      : 'black';
                  return (
                    <StyledTableCell
                      style={{ color: cellColor }}
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

      <Modal header="Races" showModal={isOpen} onClose={() => setIsOpen(false)}>
        <MaUTable {...getModalTableProps()}>
          <TableHead>
            {modalHeaderGroups.map((headerGroup) => (
              <TableRow key={headerGroup.getHeaderGroupProps().key} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableCell key={column.getHeaderProps().key} {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {modalRows.map((row, i) => {
              modalPrepareRow(row);
              return (
                <TableRow key={row.getRowProps().key} {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <StyledTableCell key={cell.getCellProps().key} {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </StyledTableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </MaUTable>
      </Modal>
    </RecordTableWrapper>
  );
};

export default RecordTable;
