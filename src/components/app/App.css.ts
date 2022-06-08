import styled from 'styled-components';
import colors from '../../colors';

export const HeaderWrapper = styled.div`
  position: relative;
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
  position: absolute;
  display: flex;
  align-items: center;
  max-width: 100%;
  padding 0 20px;
  bottom: 0;
  right: 0;
`;

export const FooterText = styled.span`
  color: ${colors.grey};
  font-size: 14px;
  @media (max-width: 415px) {
    font-size: 10px;
  }
`;

export const AboutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

export const AboutLabel = styled.label``;

export const AboutText = styled.label`
  font-size: 16px;
  @media (max-width: 415px) {
    font-size: 12px;
  }
`;
