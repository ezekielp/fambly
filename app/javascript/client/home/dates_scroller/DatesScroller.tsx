import React, { FC } from 'react';
import { MONTHS, getRotatedMonths } from './utils';
import styled from 'styled-components';

const DatesScrollerContainer = styled.div`
  height: 200px;
  width: 100%;
`;

/* Current thinking: Write a utility function that will put the people into month keys and nested day keys with arrays of objects containing the date type, the person/couple, and their IDs. Then, you pass that to the DatesScroller here. */

/* Once you have that big fancy object, you can pass each key to become a MonthItem (iterating over the getRotatedMonths array). There, you sort the keys and spit out each of the dates in order with the relevant info. */

interface DatesScrollerProps {}

export const DatesScroller: FC<DatesScrollerProps> = () => {};
