import React, { FC } from 'react';
import { colors } from 'client/shared/styles';
import styled from 'styled-components';

export interface Option {
  label: string;
  value: string;
}

interface SelectInputProps {
  options: Option[];
  error: boolean;
}

export const SelectWrapper = styled.div`
  position: relative;
  background: ${colors.white};
  display: flex;
  flex-direction: row;
  align-items: center;

  &::before {
    content: ' ';
    font-variation-settings: 'wght' 700;
    color: ${colors.lightGray};
    position: absolute;
    right: 1rem;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid ${colors.lightGray};
    z-index: 0;
  }
`;

export const StyledSelect = styled.select`
  height: 50px;
  line-height: 150%;
  padding: 0 1rem;
  width: 100%;
  background: ${colors.white};
  border-radius: 8px;
  border: 1px solid ${colors.lightGray};

  -webkit-appearance: none;

  &:focus {
    outline: none;
  }
`;

export const SelectInput: FC<SelectInputProps> = ({ options, ...rest }) => (
  <SelectWrapper>
    <StyledSelect {...rest}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </StyledSelect>
  </SelectWrapper>
);
