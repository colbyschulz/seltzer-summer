import { Button } from 'antd';
import styled from 'styled-components';
import colors from '../../colors';

export const StyledButton = styled(Button)<{ type?: string }>`
  color: ${colors.black};
  border: 1px solid ${colors.black};
  background-color: ${({ type }) => (type === 'primary' ? colors.tan : 'default')};

  &:hover {
    color: ${colors.black} !important;
  }
`;
