import styled from 'styled-components';
import colors from '../../colors';

export const StyledButton = styled.button<{ transparent?: boolean }>`
  color: ${colors.black};
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.3);
  background-color: ${({ transparent }) => (transparent ? 'transparent' : colors.tan)};
  width: 80px;
  cursor: pointer;
  border-radius: 2px;
  padding: 7px 7px;
  border: 1px solid ${colors.black};

  &&:hover {
    background-color: ${({ transparent }) => (transparent ? colors.transparentWhite : colors.transparentTan)};
  }
`;
