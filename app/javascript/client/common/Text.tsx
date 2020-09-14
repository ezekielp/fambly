import { colors, spacing, text } from 'client/shared/styles';
import styled from 'styled-components';

interface TextProps {
  color?: string;
  marginBottom?: keyof typeof spacing;
  center?: boolean;
  bold?: boolean;
  textTransform?: string;
  lineHeight?: string;
  fontSize?: keyof typeof text;
}

export const Text = styled.div`
  color: ${({ color }: TextProps) => color || colors.black};
  text-align: ${({ center }: TextProps) => (center ? 'center' : 'left')};
  text-transform: ${({ textTransform }: TextProps) =>
    textTransform ? textTransform : 'none'};
  font-size: ${({ fontSize }: TextProps) =>
    fontSize ? text[fontSize] : text[1]};
  font-weight: ${({ bold }: TextProps) => (bold ? '700' : 'normal')};
  margin-bottom: ${({ marginBottom }: TextProps) =>
    marginBottom ? spacing[marginBottom] : '0'};
  line-height: ${({ lineHeight }: TextProps) =>
    lineHeight ? lineHeight : 'normal'};
`;
