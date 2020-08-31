import React, { FC } from 'react';
import styled from 'styled-components';

export interface Option {
  label: string;
  value: string;
}

interface SelectInputProps {
  options: Option[];
  error: boolean;
}

const StyledSelect = styled.select``;

export const SelectInput: FC<SelectInputProps> = ({ options, ...rest }) => (
  <StyledSelect {...rest}>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </StyledSelect>
);
