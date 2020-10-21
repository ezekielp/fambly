import { HTMLProps } from 'react';
import styled from 'styled-components';
import { spacing } from 'client/shared/styles';

interface ProfileFieldContainerProps
  extends Omit<HTMLProps<HTMLDivElement>, 'as' | 'ref'> {
  marginBottom?: string;
}

export const ProfileFieldContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ marginBottom }: ProfileFieldContainerProps) =>
    marginBottom ? marginBottom : `${spacing[2]}`};
`;
