import React, { FC, HTMLProps } from 'react';
import { colors } from 'client/shared/styles';
import styled from 'styled-components';

interface CheckboxProps
  extends Omit<HTMLProps<HTMLInputElement>, 'as' | 'ref' | 'type'> {
  checkboxLabel: string;
  checked?: boolean;
}

const CheckboxWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  &:not(:last-child) {
    margin-bottom: 10px;
  }
`;

const CheckMark = styled.div`
  color: ${colors.orange};
  font-weight: 700;
  width: 0.95rem;
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  opacity: 0;
`;

const StyledCheckbox = styled.div<Pick<CheckboxProps, 'checked'>>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  background: ${colors.white};
  border: 1px solid ${colors.lightGray};
  margin-right: 10px;

  ${CheckMark} {
    visibility: ${(props) => (props.checked ? 'visible' : 'hidden')};
  }
`;

export const Checkbox: FC<CheckboxProps> = ({
  checkboxLabel,
  checked,
  ...rest
}) => {
  return (
    <CheckboxWrapper>
      <HiddenCheckbox checked={checked} {...rest} />
      <StyledCheckbox checked={checked}>
        <CheckMark>✓</CheckMark>
      </StyledCheckbox>
      {checkboxLabel}
    </CheckboxWrapper>
  );
};
