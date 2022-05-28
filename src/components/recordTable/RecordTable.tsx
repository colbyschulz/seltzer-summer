// import React, { FC, useMemo, useState } from 'react';
// import { TableRecord } from '../../types';

// import MaUTable from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableHead from '@material-ui/core/TableHead';
// import TableRow from '@material-ui/core/TableRow';
// import Modal from '../modal/Modal';
// import { useTable, Column } from 'react-table';
// import { RecordTableWrapper, StyledTableCell } from './recordTable.css';

// interface RecordTableProps {
//   records?: TableRecord[];
// }

// const RecordTable: FC<RecordTableProps> = ({ records = [] }) => {
//   const { getTableProps, headerGroups, rows, prepareRow } = useTable({
//     columns,
//     data,
//   });

//   return (
//     <RecordTableWrapper>
//       <MaUTable {...getTableProps()}>
//         <TableHead>
//           {headerGroups.map((headerGroup) => (
//             <TableRow key={headerGroup.getHeaderGroupProps().key} {...headerGroup.getHeaderGroupProps()}>
//               {headerGroup.headers.map((column) => (
//                 <TableCell key={column.getHeaderProps().key} {...column.getHeaderProps()}>
//                   {column.render('Header')}
//                 </TableCell>
//               ))}
//             </TableRow>
//           ))}
//         </TableHead>
//         <TableBody>
//           {rows.map((row) => {
//             prepareRow(row);
//             return (
//               <TableRow
//                 key={row.getRowProps().key}
//                 {...row.getRowProps()}
//                 onClick={() => {
//                   setActiveName(row.original.name);
//                   setIsOpen(true);
//                 }}
//               >
//                 {row.cells.map((cell) => {
//                   const cellColor =
//                     cell.column.Header === 'Delta'
//                       ? cell.value.includes('-')
//                         ? 'green'
//                         : cell.value === '0:00'
//                         ? 'black'
//                         : '#D30703'
//                       : 'black';
//                   return (
//                     <StyledTableCell
//                       style={{ color: cellColor }}
//                       key={cell.getCellProps().key}
//                       {...cell.getCellProps()}
//                     >
//                       {cell.render('Cell')}
//                     </StyledTableCell>
//                   );
//                 })}
//               </TableRow>
//             );
//           })}
//         </TableBody>
//       </MaUTable>
//     </RecordTableWrapper>
//   );
// };

// export default RecordTable;
