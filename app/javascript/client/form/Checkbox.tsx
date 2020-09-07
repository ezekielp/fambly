import React, { FC, HTMLProps } from 'react';

interface CheckboxProps
  extends Omit<HTMLProps<HTMLInputElement>, 'as' | 'ref' | 'type'> {
  checkboxLabel: string;
  checked?: boolean;
}

export const Checkbox: FC<CheckboxProps> = ({
  checkboxLabel,
  checked,
  ...rest
}) => {
  return (
    <div>
      <input type="checkbox" checked={checked} {...rest} />
      {checkboxLabel}
    </div>
  );
};
