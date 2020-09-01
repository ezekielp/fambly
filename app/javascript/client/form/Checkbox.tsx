import React, { FC, HTMLProps } from 'react';

interface CheckboxProps
  extends Omit<HTMLProps<HTMLInputElement>, 'as' | 'ref' | 'type'> {}

export const Checkbox: FC<CheckboxProps> = ({ ...rest }) => (
  <input type="checkbox" {...rest} />
);
