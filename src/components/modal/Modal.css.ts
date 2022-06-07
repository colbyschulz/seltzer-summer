import styled from 'styled-components';
import Crumpled1 from '../../assets/images/crumpled1.jpg';

export const ModalWrapper = styled.div`
  position: fixed;
  inset: 0; /* inset sets all 4 values (top right bottom left) much like how we set padding, margin etc., */
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease-in-out;
  overflow: hidden;
  z-index: 2;
`;

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url(${Crumpled1});
  background-size: cover;
  padding: 15px 20px 20px 20px;
  border-radius: 5px;
  max-height: 70%;
  overflow-y: scroll;
`;

export const IconRow = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-end;
`;

export const Children = styled.div`
  flex-shrink: 1;
`;

export const HeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border-color: grey;
  border-bottom-width: 1px;
  padding-bottom: 20px;
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
