import React, { HTMLProps, forwardRef, RefObject } from 'react';
import { colors, text } from 'client/shared/styles';
import styled from 'styled-components';

interface TextAreaProps
  extends Omit<HTMLProps<HTMLTextAreaElement>, 'as' | 'ref' | 'autoComplete'> {}

const StyledTextArea = styled.textarea`
  width: 95%;
  border: 1px solid ${colors.lightGray};
  border-radius: 8px;
  height: 250px;
  padding-top: 1rem;
  padding-left: 1rem;
  font-family: Quicksand;
  font-size: ${text[2]};
`;

export const TextArea = forwardRef(({ ...rest }: TextAreaProps, ref) => (
  <StyledTextArea {...rest} ref={ref as RefObject<HTMLTextAreaElement>} />
));
