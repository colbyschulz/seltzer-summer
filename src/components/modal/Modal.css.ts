import styled from 'styled-components';

export const ModalWrapper = styled.div<{ visible: boolean }>`
  display: ${({ visible }) => (visible ? 'flex' : 'none')};
  margin: 0;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
`;

export const ModalView = styled.div`
  display: flex;
  background-color: rgba(0, 0, 0, 0.4);
  align-items: center;
  justify-content: center;
  padding: 10px;
  flex: 1;
`;

export const ModalCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
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
