import { colors, spacing, text } from 'client/shared/styles';
import styled from 'styled-components';

interface TextProps {
  color?: string;
  marginBottom?: keyof typeof spacing;
  center?: boolean;
  bold?: boolean;
  semiBold?: boolean;
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
    fontSize !== null && fontSize !== undefined ? text[fontSize] : text[1]};
  font-variation-settings: ${({ bold, semiBold }: TextProps) => {
    if (bold) {
      return "'wght' 700;";
    } else if (semiBold) {
      return "'wght' 550";
    }
    return "'wght' 400";
  }};
  margin-bottom: ${({ marginBottom }: TextProps) =>
    marginBottom !== undefined ? spacing[marginBottom] : '0'};
  line-height: ${({ lineHeight }: TextProps) =>
    lineHeight ? lineHeight : 'normal'};
`;
