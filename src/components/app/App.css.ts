import styled from 'styled-components';

export const AppWrapper = styled.div`
  margin: 0 20px;
  display: flex;
  flex-direction: column;
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
  border-bottom: ${({ error }) => (error ? '1px solid #D30703' : '1px solid black')};
`;

export const StyledDatePicker = styled(Input)`
  font-family: 'Roboto', Open-Sans, Helvetica, Sans-Serif;
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
  color: white;
  background-color: #884d1d;
  height: 40px;
  width: 80px;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 20px;

  &&:hover {
    background-color: #b16b2d;
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
  color: ${({ error }) => (error ? '#D30703' : 'black')};
`;
