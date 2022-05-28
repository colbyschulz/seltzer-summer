import React, { FC, useMemo } from 'react';
import { TableRecord } from '../../types';

import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { useTable, Column } from 'react-table';
import { RecordTableWrapper } from './recordTable.css';

interface RecordTableProps {
  records?: TableRecord[];
}

const RecordTable: FC<RecordTableProps> = ({ records = [] }) => {
  const data = useMemo(
    () => records.map(({ fields: { name, distance, time } }) => ({ name, distance, time })),
    [records],
  );

  const columns: Array<Column<{ name: string; distance: string; time: string }>> = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Distance',
        accessor: 'distance',
      },
      {
        Header: 'Time',
        accessor: 'time',
      },
    ],
    [],
  );

  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
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
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <TableRow key={row.getRowProps().key} {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <TableCell key={cell.getCellProps().key} {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </MaUTable>
    </RecordTableWrapper>
  );
};

export default RecordTable;
