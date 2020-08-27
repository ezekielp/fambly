import React, { HTMLProps, forwardRef, RefObject } from 'react';
import styled from 'styled-components';

interface TextAreaProps
  extends Omit<HTMLProps<HTMLTextAreaElement>, 'as' | 'ref' | 'autoComplete'> {}

const StyledTextArea = styled.textarea`
  width: 100%;
`;

export const TextArea = forwardRef(({ ...rest }: TextAreaProps, ref) => (
  <StyledTextArea {...rest} ref={ref as RefObject<HTMLTextAreaElement>} />
));
