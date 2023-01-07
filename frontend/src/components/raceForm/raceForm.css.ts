import { Form, Input, Select } from 'antd';
import styled from 'styled-components';
import colors from '../../colors';
import DatePicker from '../datepicker/Datepicker';

interface InputProps {
  error?: boolean;
}
export const StyledInput = styled(Input)<InputProps>`
  border: none;
  border-radius: none;
  box-shadow: none;
  color: ${colors.black};
  outline: none;
  border-bottom: ${({ error }) => (error ? `1px solid ${colors.red}` : '1px solid black')};
  background-color: transparent;
`;

interface InputProps {
  error?: boolean;
}
export const StyledSelect = styled(Select)<InputProps>`
  color: ${colors.black};
  outline: none;
  border-bottom: ${({ error }) => (error ? `1px solid ${colors.red}` : '1px solid black')};
  background-color: transparent;
  width: 100%;
`;

interface InputProps {
  error?: boolean;
}
export const StyledDatePicker = styled(DatePicker)<InputProps>`
  color: ${colors.black};
  border: none;
  border-radius: 0;
  box-shadow: none;
  outline: none;
  border-bottom: ${({ error }) => (error ? `1px solid ${colors.red}` : '1px solid black')};
  background-color: transparent;
  width: 100%;
`;

export const FormItem = styled(Form.Item)`
  margin: 0 0 20px 0;

  .ant-form-item-label {
    padding: 0 0 5px;
  }
  .ant-form-item-explain-error {
    font-size: 12px;
  }
  .ant-select-status-error {
    border-color: ${colors.red};
  }
`;
