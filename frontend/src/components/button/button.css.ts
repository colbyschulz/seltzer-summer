import styled from 'styled-components';
import colors from '../../colors';

export const StyledButton = styled.button`
  color: ${colors.black};
  cursor: pointer;
  border: 1px solid ${colors.black};
  background-color: ${colors.tan};
  padding: 6px 10px;
  border-radius: 2px;
  &:hover {
    color: ${colors.black};
    background-color: #ead3ac;
`;
