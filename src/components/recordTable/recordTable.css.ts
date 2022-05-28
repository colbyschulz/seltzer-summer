import { TableCell } from '@material-ui/core';
import styled from 'styled-components';

export const RecordTableWrapper = styled.div`
  overflow-y: scroll;
  margin-bottom: 30px;
`;

export const StyledTableCell = styled(TableCell)<{ isFaster?: boolean }>`
  color: ${({ isFaster }) => (isFaster ? 'green' : 'red')};
`;
