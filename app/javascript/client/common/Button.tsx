import { HTMLProps } from 'react';
import { colors } from 'client/shared/styles';
import styled from 'styled-components';

export interface ButtonProps
  extends Omit<HTMLProps<HTMLButtonElement>, 'as' | 'ref'> {
  marginRight?: string;
}

export const Button = styled.button`
  border: 1px solid ${colors.black};
  border-radius: 50px;
  padding: 0.5rem 1.5rem;
  margin-right: ${({ marginRight }: ButtonProps) =>
    marginRight ? marginRight : '0'};

  &:active {
    background: ${colors.orange};
    color: ${colors.white};
    border: 1px solid ${colors.white};
  }
`;
