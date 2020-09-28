import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';
import { Text } from 'client/common/Text';
import { colors, text } from 'client/shared/styles';

export interface AccordionSectionProps {
  header: string;
}

export const AccordionHeader = styled.summary`
  font-size: ${text[2]};
  display: block;
  cursor: pointer;
  padding: 0.5rem 1rem;
  background: ${colors.orange};
  border: 2px solid ${colors.white};
  color: ${colors.white};
  outline: none;
  border-radius: 8px;
`;

const slideDown = keyframes`
  from {
    opacity: 0;
    height: 0;
  }

  to {
    opacity: 1;
    height: 100%;
  }
`;

const showContent = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const AccordionTextContainer = styled.div`
  background: ${colors.white};
  padding: 20px;
  animation-name: ${slideDown};
  animation-duration: 0.3s;
  animation-fill-mode: forwards;
`;

const AccordionText = styled(Text)`
  opacity: 0;
  animation-name: ${showContent};
  animation-duration: 0.6s;
  animation-fill-mode: forwards;
  animation-delay: 0.2s;
`;

export const AccordionSection: FC<AccordionSectionProps> = ({
  header,
  children,
}) => (
  <details>
    <AccordionHeader>{header}</AccordionHeader>
    <AccordionTextContainer>
      <AccordionText fontSize={1}>{children}</AccordionText>
    </AccordionTextContainer>
  </details>
);
