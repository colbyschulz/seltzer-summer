import { TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import React, { useMemo } from 'react';
import { useQuery } from 'react-query';
import { Column, useTable } from 'react-table';
import { getRecords } from '../../reactQuery/api';
import { queryKeys } from '../../reactQuery/queryKeys';
import { racesByNameId } from '../../utils';
import { StyledTableCell } from '../leaderboardScreen/leaderboardScreen.css';
import { DetailScreenWrapper } from './detailScreen.css';
import MaUTable from '@material-ui/core/Table';
import { useParams } from 'react-router-dom';

const DetailScreen = () => {
  const { data: records = [] } = useQuery(queryKeys.records, () => getRecords());
  const { nameId } = useParams();
  const dataNormalizedById = useMemo(() => racesByNameId(records), [records]);
  const detailModalData = useMemo(
    () =>
      dataNormalizedById[nameId]
        ?.map(({ name, date, raceName, time, distance }) => {
          const minutes = Math.floor(Math.abs(time) / 60).toString();
          const seconds = (Math.abs(time) % 60).toLocaleString('US', {
            minimumIntegerDigits: 2,
            useGrouping: false,
          });

          const [YYYY, MM, DD] = date.split('-');
          const dateString = new Date(parseInt(YYYY), parseInt(MM) - 1, parseInt(DD));
          return {
            name,
            date: dateString.toLocaleDateString('US'),
            raceName,
            time: `${minutes}:${seconds}`,
            distance,
          };
        })
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [],
    [records],
  );

  const detailColumns: Array<Column<{ date: string; name: string; raceName: string; distance: string; time: string }>> =
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
  const {
    getTableProps: getModalTableProps,
    headerGroups: modalHeaderGroups,
    rows: modalRows,
    prepareRow: modalPrepareRow,
  } = useTable({
    columns: detailColumns,
    data: detailModalData,
  });
  return (
    <DetailScreenWrapper>
      <MaUTable {...getModalTableProps()} padding="none" stickyHeader>
        <TableHead>
          {modalHeaderGroups.map((headerGroup) => (
            <TableRow key={headerGroup.getHeaderGroupProps().key} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableCell
                  style={{ padding: '12px 8px' }}
                  key={column.getHeaderProps().key}
                  {...column.getHeaderProps()}
                >
                  {column.render('Header')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {modalRows.map((row) => {
            modalPrepareRow(row);
            return (
              <TableRow key={row.getRowProps().key} {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <StyledTableCell
                      style={{ padding: '12px', overflowWrap: 'break-word' }}
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
    </DetailScreenWrapper>
  );
};

export default DetailScreen;
