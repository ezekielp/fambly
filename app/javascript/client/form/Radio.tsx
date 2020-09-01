import React, { FC, HTMLProps } from 'react';
import styled from 'styled-components';

interface RadioProps
  extends Omit<HTMLProps<HTMLInputElement>, 'as' | 'ref' | 'type'> {
  checked?: boolean;
  radioLabel: string;
}

const RadioWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const StyledRadio = styled.input.attrs({ type: 'radio' })``;

export const Radio: FC<RadioProps> = ({ checked, radioLabel, ...rest }) => (
  <RadioWrapper>
    <StyledRadio checked={checked} {...rest} />
    {radioLabel}
  </RadioWrapper>
);
