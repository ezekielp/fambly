import React, { FC, ChangeEvent } from 'react';
import { Radio } from './Radio';

interface Option {
  label: string;
  value: string;
}

interface RadioGroupProps {
  options: Option[];
  value: string;
  onChange: (val: string) => void;
}

export const RadioGroup: FC<RadioGroupProps> = ({
  options,
  value,
  onChange,
  ...rest
}) => (
  <div>
    {options.map((option) => (
      <Radio
        key={option.value}
        radioLabel={option.label}
        value={option.value}
        checked={option.value === value}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          onChange(event.target.value)
        }
        {...rest}
      />
    ))}
  </div>
);
