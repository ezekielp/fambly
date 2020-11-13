import React, { FC } from 'react';
import { MonthItem } from './MonthItem';
import { MonthsObjectForDatesScroller } from 'client/home/utils';
import { MONTHS, getRotatedMonths } from './utils';
import styled from 'styled-components';

const DatesScrollerContainer = styled.div`
  height: 200px;
  width: 100%;
`;

/* Current thinking: Write a utility function that will put the people into month keys and nested day keys with arrays of objects containing the date type, the person/couple, and their IDs. Then, you pass that to the DatesScroller here. */

/* Once you have that big fancy object, you can pass each key to become a MonthItem (iterating over the getRotatedMonths array). There, you sort the keys and spit out each of the dates in order with the relevant info. */

interface DatesScrollerProps {
  monthsObject: MonthsObjectForDatesScroller;
}

export const DatesScroller: FC<DatesScrollerProps> = ({ monthsObject }) => {
  const monthItems = getRotatedMonths(MONTHS).map((month) => {
    const monthAsNumber = parseInt(month);
    if (monthsObject[monthAsNumber]) {
      return (
        <MonthItem
          key={month}
          month={monthAsNumber}
          daysObject={monthsObject[monthAsNumber]}
        />
      );
    }
    return <></>;
  });

  return <DatesScrollerContainer>{monthItems}</DatesScrollerContainer>;
};
