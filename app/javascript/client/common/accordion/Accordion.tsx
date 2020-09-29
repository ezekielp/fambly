import { spacing as spacingOptions } from 'client/shared/styles';
import styled from 'styled-components';

interface AccordionProps {
  spacing?: keyof typeof spacingOptions;
}

export const Accordion = styled.div`
  margin-bottom: ${({ spacing }: AccordionProps) =>
    spacing ? spacingOptions[spacing] : 'none'};
`;
