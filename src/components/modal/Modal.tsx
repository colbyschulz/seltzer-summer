import React, { FC, useEffect } from 'react';
import ReactPortal from '../ReactPortal';
import { Children, HeaderRow, HeaderText, IconRow, ModalContent, ModalWrapper } from './Modal.css';

interface ModalProps {
  showModal: boolean;
  onClose: () => void;
  hideCloseButton?: boolean;
  header?: string | React.ReactNode;
  children?: React.ReactNode;
  portalId?: string;
}

const Modal: FC<ModalProps> = ({ showModal, onClose, header, children, portalId = 'modal-portal' }) => {
  useEffect(() => {
    const closeOnEscapeKey = (event: KeyboardEvent) => (event.key === 'Escape' ? onClose() : null);
    document.body.addEventListener('keydown', closeOnEscapeKey);
    return () => {
      document.body.removeEventListener('keydown', closeOnEscapeKey);
    };
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : 'auto';
  }, [showModal]);

  if (!showModal) {
    return null;
  }

  return (
    <ReactPortal wrapperId={portalId}>
      <ModalWrapper>
        <ModalContent>
          <IconRow>
            <div style={{ padding: '10px' }} onClick={onClose}>
              X
            </div>
          </IconRow>
          {header ? (
            <HeaderRow>{typeof header === 'string' ? <HeaderText>{header}</HeaderText> : header}</HeaderRow>
          ) : null}
          {children}
        </ModalContent>
      </ModalWrapper>
    </ReactPortal>
  );
};

export default Modal;
