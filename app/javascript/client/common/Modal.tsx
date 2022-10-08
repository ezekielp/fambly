import React, { FC, useRef, useEffect } from 'react';
import { useDetectOutsideClick } from 'client/common/useDetectOutsideClick';
import { XMark } from 'client/assets/XMark';
import { colors } from 'client/shared/styles';
import styled from 'styled-components';

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.6);
  overflow-y: auto;
`;

// width: 90%;
const ModalContainer = styled.div`
  background: ${colors.white};
  border-radius: 5px;
  max-width: 400px;
  margin: 50px auto;
  padding: 2rem;
  z-index: 11;
  position: relative;
`;

const StyledXMark = styled(XMark)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
`;

interface ModalProps {
  // setFieldToAdd?: (field: string) => void;
  onClose?: () => void;
  children: React.ReactNode;
}

export const Modal: FC<ModalProps> = ({ onClose, children }) => {
  const modalRef = useRef(null);
  const [isActive, setIsActive] = useDetectOutsideClick(modalRef, true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'inherit';
    };
  });

  useEffect(() => {
    if (!isActive && onClose) {
      onClose();
    }
  }, [isActive]);

  return (
    <>
      {isActive && (
        <ModalBackground>
          <ModalContainer ref={modalRef}>
            <StyledXMark
              onClick={() => setIsActive(false)}
              fill={colors.orange}
              width="25"
            />
            {children}
          </ModalContainer>
        </ModalBackground>
      )}
    </>
  );
};
