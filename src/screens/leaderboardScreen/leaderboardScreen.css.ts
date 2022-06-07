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
  color: #131313;
  outline: none;
  border-bottom: ${({ error }) => (error ? `1px solid ${colors.red}` : '1px solid black')};
  background-color: transparent;
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
  color: ${({ error }) => (error ? `${colors.red}` : '#131313')};
`;
