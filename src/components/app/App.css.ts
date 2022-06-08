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
