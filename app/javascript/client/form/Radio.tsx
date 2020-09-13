import React, { FC, HTMLProps } from 'react';
import styled from 'styled-components';
import { colors } from 'client/shared/styles';

interface RadioProps
  extends Omit<HTMLProps<HTMLInputElement>, 'as' | 'ref' | 'type'> {
  checked?: boolean;
  radioLabel: string;
}

const RadioWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  &:not(:last-child) {
    margin-bottom: 10px;
  }
`;

const HiddenRadio = styled.input.attrs({ type: 'radio' })`
  position: absolute;
  opacity: 0;
`;

const StyledRadio = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: ${(props: Pick<RadioProps, 'checked'>) =>
    props.checked ? colors.orange : colors.white};
  border: 1px solid ${colors.lightGray};
  margin-right: 10px;
`;

export const Radio: FC<RadioProps> = ({ checked, radioLabel, ...rest }) => (
  <RadioWrapper>
    <div>
      <HiddenRadio checked={checked} {...rest} />
      <StyledRadio checked={checked}></StyledRadio>
    </div>
    {radioLabel}
  </RadioWrapper>
);
