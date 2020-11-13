import React, { FC } from 'react';
import { DayItem } from './DayItem';
import { DaysObjectForDatesScroller } from 'client/home/utils';
import { MONTHS } from 'client/profiles/birthdate/utils';
import { Text } from 'client/common/Text';
import styled from 'styled-components';

const MonthItemContainer = styled.div``;

interface MonthItemProps {
  month: number;
  daysObject: DaysObjectForDatesScroller;
}

export const MonthItem: FC<MonthItemProps> = ({ month, daysObject }) => {
  const dayItems = Object.keys(daysObject)
    .sort()
    .map((day) => {
      const dayAsNumber = parseInt(day);
      return (
        <DayItem
          key={day}
          day={dayAsNumber}
          peopleAndCouplesInfo={daysObject[dayAsNumber]}
        />
      );
    });

  const monthText = MONTHS[month] as string;

  return (
    <MonthItemContainer>
      <Text fontSize={3} semiBold>
        {monthText}
      </Text>
      {dayItems}
    </MonthItemContainer>
  );
};
