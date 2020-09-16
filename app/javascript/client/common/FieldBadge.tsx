import { colors, text } from 'client/shared/styles';
import styled from 'styled-components';

interface FieldBadgeProps {
  backgroundColor: keyof typeof colors;
  textColor: keyof typeof colors;
  marginRight?: string;
}

export const FieldBadge = styled.div`
  color: ${({ textColor }: FieldBadgeProps) => textColor};
  background: ${({ backgroundColor }: FieldBadgeProps) => backgroundColor};
  margin-right: ${({ marginRight }: FieldBadgeProps) =>
    marginRight ? marginRight : '10px'};
  padding: 2px 4px;
  border-radius: 3px;
  font-size: ${text[0]};
`;
