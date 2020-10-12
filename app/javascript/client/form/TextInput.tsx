import React, { HTMLProps } from 'react';
import { colors } from 'client/shared/styles';
import styled from 'styled-components';

interface TextInputProps
  extends Omit<
    HTMLProps<HTMLInputElement>,
    'as' | 'ref' | 'autoComplete' | 'autoCorrect'
  > {}

const StyledTextInput = styled.input.attrs({
  autoComplete: 'off',
  autoCorrect: 'off',
})`
  border: 1px solid ${colors.lightGray};
  border-radius: 8px;
  height: 50px;
  width: 100%;
  line-height: 150%;
  padding: 0 1rem;

  &:focus {
    outline: none;
  }
`;

export const TextInput = React.forwardRef(
  ({ ...rest }: TextInputProps, ref) => (
    <StyledTextInput {...rest} ref={ref as React.RefObject<HTMLInputElement>} />
  ),
);
