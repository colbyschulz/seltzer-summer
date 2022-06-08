import styled from 'styled-components';

export const SignImage = styled.img`
  position: absolute;
  transform: rotate(-6deg);
  right: 115px;
  height: 100px;
  bottom: -74px;
  @media (max-width: 415px) {
    height: 82px;
    bottom: -69px;
    right: 107px;
  }
`;

export const SignText = styled.span`
  position: absolute;
  padding: 10px;
  font-size: 0.875rem;
  transform: rotate(-6deg);
  right: 140px;

  bottom: -57px;
  @media (max-width: 415px) {
    right: 121px;
  }
`;
