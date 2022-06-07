import styled from 'styled-components';
import colors from '../../colors';

export const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  max-width: 100%;
  justify-content: center;
  max-height: 400px;
  padding: 10px;
  background-color: ${colors.transparentWhite};
`;

export const HeaderImage = styled.img`
  max-height: 115px;
  max-width: 100%;
`;

export const FooterWrapper = styled.div`
  display: flex;
  align-items: center;
  max-width: 100%;
  padding 0 10px;
  justify-content: flex-end;
`;

export const FooterText = styled.span`
  color: ${colors.grey};
  font-size: 10px;
`;
