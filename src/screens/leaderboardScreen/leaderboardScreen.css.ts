import styled from 'styled-components';
import { TableCell } from '@material-ui/core';
import colors from '../../colors';

export const LeaderboardTableWrapper = styled.div`
  -webkit-overflow-scrolling: touch;
  overflow-y: scroll;
  margin-top: 10px;
  border-radius: 5px;
  background-color: ${colors.tan};
`;

export const StyledTableCell = styled(TableCell)<{ isFaster?: boolean }>`
  color: ${({ isFaster }) => (isFaster ? 'green' : 'red')};
`;

export const LeaderboardScreenWrapper = styled.div`
  margin: 20px;
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  overflow-y: hidden;
`;

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

interface InputProps {
  error?: boolean;
}
export const Input = styled.input<InputProps>`
  padding: 2px 5px;
  margin-bottom: 20px;
  margin-top: 5px;
  border: none;
  border-radius: none;
  box-shadow: none;
  outline: none;
  border-bottom: ${({ error }) => (error ? `1px solid ${colors.red}` : '1px solid black')};
`;

export const StyledDatePicker = styled(Input)`
  padding: 1px 5px;
  background-color: white;
`;

export const Select = styled.select`
  padding: 5px;
  margin-bottom: 20px;
  margin-top: 5px;
`;

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledButton = styled.button`
  color: black;
  box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.3);
  background-color: ${colors.tan};
  min-height: 35px;
  width: 80px;
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: 5px;
  &&:hover {
    background-color: ${colors.lightBrown};
  }
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: white;
  width: 80%;
  height: 80%;
  margin: auto;
`;

export const InputLabel = styled.label<InputProps>`
  font-size: 14px;
  margin-bottom: 3px;
  color: ${({ error }) => (error ? `${colors.red}` : 'black')};
`;
