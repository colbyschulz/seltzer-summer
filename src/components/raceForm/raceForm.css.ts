import styled from 'styled-components';
import colors from '../../colors';

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

export const InputLabel = styled.label<InputProps>`
  font-size: 14px;
  margin-bottom: 3px;
  color: ${({ error }) => (error ? `${colors.red}` : '#131313')};
`;
