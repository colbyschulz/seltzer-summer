import styled from 'styled-components';
import { TableCell } from '@material-ui/core';
import colors from '../../colors';

export const StyledTableCell = styled(TableCell)<{ isFaster?: boolean }>`
  color: ${({ isFaster }) => (isFaster ? 'green' : 'red')};
`;

export const LeaderboardScreenWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  overflow-y: hidden;
  margin-top: 15px;
`;

export const LeaderboardTableWrapper = styled.div`
  -webkit-overflow-scrolling: touch;
  overflow-y: scroll;
  border-radius: 5px;
  margin: 10px 20px 20px 20px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
  background-color: ${colors.transparentWhite};
`;

export const StyledButton = styled.button`
  color: #131313;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.3);
  background-color: ${colors.transparentTan};
  width: 80px;
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 5px;

  &&:hover {
    background-color: ${colors.lightBrown};
  }
`;
