import React, { HTMLProps, forwardRef, RefObject } from 'react';
import { colors } from 'client/shared/styles';
import styled from 'styled-components';

interface TextAreaProps
  extends Omit<HTMLProps<HTMLTextAreaElement>, 'as' | 'ref' | 'autoComplete'> {}

const StyledTextArea = styled.textarea`
  width: 100%;
  border: 1px solid ${colors.lightGray};
  border-radius: 8px;
  height: 100px;
  padding-top: 1rem;
  padding-left: 1rem;
`;

export const TextArea = forwardRef(({ ...rest }: TextAreaProps, ref) => (
  <StyledTextArea {...rest} ref={ref as RefObject<HTMLTextAreaElement>} />
));
