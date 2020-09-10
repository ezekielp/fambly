import React, { FC, SVGProps } from 'react';
import { colors } from 'client/shared/styles';

export const XMark: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="-1 -1 11 11">
    <path
      fill={props.fill ? props.fill : colors.white}
      stroke={props.fill ? props.fill : colors.white}
      strokeLinecap="round"
      strokeWidth="1"
      d="m0 0 9,9 M0 9 9,0"
    />
  </svg>
);
