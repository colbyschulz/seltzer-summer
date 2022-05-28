import React, { FC } from 'react';
import { Children, HeaderRow, HeaderText, IconRow, ModalCard, ModalView, ModalWrapper } from './Modal.css';

interface ModalProps {
  showModal: boolean;
  onClose: () => void;
  hideCloseButton?: boolean;
  header?: string | React.ReactNode;
  children?: React.ReactNode;
}

const Modal: FC<ModalProps> = ({ showModal, onClose, header, children }) => (
  <ModalWrapper visible={showModal}>
    <ModalView>
      <ModalCard>
        <IconRow>
          <div style={{ padding: '10px' }} onClick={onClose}>
            X
          </div>
        </IconRow>
        {header ? (
          <HeaderRow>{typeof header === 'string' ? <HeaderText>{header}</HeaderText> : header}</HeaderRow>
        ) : null}
        <Children>{children}</Children>
      </ModalCard>
    </ModalView>
  </ModalWrapper>
);

export default Modal;
