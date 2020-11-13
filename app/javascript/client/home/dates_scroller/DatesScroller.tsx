import React, { FC } from 'react';
import { MonthItem } from './MonthItem';
import { MonthsObjectForDatesScroller } from 'client/home/utils';
import { MONTHS, getRotatedMonths } from './utils';
import { Text } from 'client/common/Text';
import { colors } from 'client/shared/styles';
import styled from 'styled-components';

const DatesScrollerContainer = styled.div`
  height: 200px;
  overflow: scroll;
  border: 1px solid black;
  border-radius: 8px;
  padding: 1rem;
`;

export const DatesScrollerSectionDivider = styled.hr`
  height: 1px;
  border: none;
  background-color: ${colors.lightGray};
  margin: 1rem 0 0.5rem 0;
`;

interface DatesScrollerProps {
  monthsObject: MonthsObjectForDatesScroller;
}

export const DatesScroller: FC<DatesScrollerProps> = ({ monthsObject }) => {
  const months = getRotatedMonths(MONTHS).filter((month) => {
    return !!monthsObject[month];
  });
  const monthItems = months.map((month, idx) => {
    if (monthsObject[month]) {
      return (
        <>
          <MonthItem
            key={month}
            month={month}
            daysObject={monthsObject[month]}
          />
          {idx < months.length - 1 && <DatesScrollerSectionDivider />}
        </>
      );
    }
  });

  return (
    <DatesScrollerContainer>
      <Text fontSize={3} semiBold>
        Birthdays and anniversaries
      </Text>
      <DatesScrollerSectionDivider />
      {monthItems}
    </DatesScrollerContainer>
  );
};
