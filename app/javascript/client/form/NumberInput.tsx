import React, { forwardRef, ChangeEvent, useState } from 'react';
import { TextInput } from 'client/form/TextInput';

export interface NumberInputProps {
  value: number | null;
  onChange: (val: number | null) => void;
}

export const NumberInput = forwardRef(
  ({ onChange, value, ...rest }: NumberInputProps, ref) => {
    const [inputValue, setInputValue] = useState(value ? value.toString() : '');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      const valToUpdate = newValue ? parseInt(newValue) : null;

      onChange(valToUpdate);
      setInputValue(newValue);
    };

    return (
      <TextInput
        {...rest}
        onChange={handleChange}
        value={inputValue}
        type="number"
        inputMode="numeric"
        ref={ref}
      />
    );
  },
);
