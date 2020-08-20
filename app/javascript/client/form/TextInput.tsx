import React, { HTMLProps } from 'react';
import styled from 'styled-components';

interface TextInputProps
  extends Omit<HTMLProps<HTMLInputElement>, 'as' | 'ref' | 'autoComplete'> {}

const StyledTextInput = styled.input`
  line-height: 150%;
`;

export const TextInput = React.forwardRef(
  ({ ...rest }: TextInputProps, ref) => (
    <StyledTextInput {...rest} ref={ref as React.RefObject<HTMLInputElement>} />
  ),
);
