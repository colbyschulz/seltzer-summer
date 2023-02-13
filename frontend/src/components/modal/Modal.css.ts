import styled from 'styled-components';
import Crumpled1 from '../../assets/images/crumpled1.jpg';
import colors from '../../colors';

export const ModalWrapper = styled.div<{ showModal: boolean }>`
  position: fixed;
  inset: 0; /* inset sets all 4 values (top right bottom left) much like how we set padding, margin etc., */
  background-color: rgba(0, 0, 0, 0.6);
  display: ${({ showModal }) => (showModal ? 'flex' : 'none')};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
  z-index: 2;
`;

export const ModalBackgroundWrapper = styled.div`
  background-image: url(${Crumpled1});
  background-size: cover;
  max-height: 70%;
  max-width: 90%;
  border-radius: 5px;
`;

export const ModalContent = styled.div`
  background-color: ${colors.transparentWhite};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 20px 20px 20px;
  border-radius: 5px;
`;

export const IconRow = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-end;
`;

export const HeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border-color: grey;
  border-bottom-width: 1px;
  margin-bottom: 12px;
  width: 100%;
`;

export const HeaderText = styled.div``;

export const FooterRow = styled.div`
  border-color: grey
  border-top-width: 1px;
  padding-top: 20px;
  margin-top: 12px;
`;
