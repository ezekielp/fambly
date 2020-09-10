import React, { FC, SVGProps } from 'react';

export const Sandwich: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 80" {...props}>
    <rect width="100" height="10" rx="8"></rect>
    <rect y="30" width="100" height="10" rx="8"></rect>
    <rect y="60" width="100" height="10" rx="8"></rect>
  </svg>
);
