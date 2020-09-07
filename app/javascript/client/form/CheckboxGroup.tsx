import React, { ChangeEvent, FC } from 'react';
import { Checkbox } from './Checkbox';

interface Option {
  label: string;
  value: string;
}

interface CheckboxGroupProps {
  options: Option[];
  value: string[] | string;
  onChange: (val: string[] | string) => void;
}

export const CheckboxGroup: FC<CheckboxGroupProps> = ({
  options,
  value,
  onChange,
  ...rest
}) => {
  const handleOnChange = (selectedValue: string) => {
    if (typeof value === 'string') {
      onChange(selectedValue);
    } else {
      let updatedValue = [...value];

      if (value.includes(selectedValue)) {
        updatedValue = value.filter((value) => value !== selectedValue);
      } else {
        updatedValue.push(selectedValue);
      }

      onChange(updatedValue);
    }
  };

  const checked = (checkboxValue: string) => {
    if (typeof value === 'string') {
      return value === checkboxValue;
    } else {
      return value.includes(checkboxValue);
    }
  };

  return (
    <div>
      {options.map((option) => (
        <Checkbox
          key={option.value}
          checkboxLabel={option.label}
          value={option.value}
          checked={checked(option.value)}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            handleOnChange(event.target.value)
          }
          {...rest}
        />
      ))}
    </div>
  );
};
