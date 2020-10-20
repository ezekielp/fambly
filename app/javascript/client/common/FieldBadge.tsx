import { colors, text } from 'client/shared/styles';
import styled from 'styled-components';

interface FieldBadgeProps {
  backgroundColor: keyof typeof colors;
  textColor: keyof typeof colors;
  marginRight?: string;
  marginBottom?: string;
}

export const FieldBadge = styled.div`
  color: ${({ textColor }: FieldBadgeProps) => colors[textColor]};
  background: ${({ backgroundColor }: FieldBadgeProps) =>
    colors[backgroundColor]};
  margin-right: ${({ marginRight }: FieldBadgeProps) =>
    marginRight ? marginRight : '10px'};
  padding: 2px 4px;
  border-radius: 3px;
  font-size: ${text[0]};
  border: ${({ backgroundColor }: FieldBadgeProps) =>
    backgroundColor === 'white' ? '1px solid black' : 'none'};
  width: fit-content;
  margin-bottom: ${({ marginBottom }: FieldBadgeProps) =>
    marginBottom ? marginBottom : '0'};
`;
