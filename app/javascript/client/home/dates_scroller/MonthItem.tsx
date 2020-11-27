import React, { FC } from 'react';
import { DayItem } from './DayItem';
import { DaysObjectForDatesScroller } from 'client/home/utils';
import { MONTHS } from 'client/profiles/birthdate/utils';
import { Text } from 'client/common/Text';
import { MONTH_COLORS, MONTH_TEXT_COLORS } from './utils';
import { colors } from 'client/shared/styles';
import styled from 'styled-components';

const MonthItemContainer = styled.div``;

interface MonthTextProps {
  backgroundColor: keyof typeof colors;
}

const MonthText = styled(Text)`
  padding: 3px 4px;
  border-radius: 8px;
  background: ${({ backgroundColor }: MonthTextProps) =>
    colors[backgroundColor]};
`;

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

  console.log(month);
  const monthText = MONTHS[month] as string;
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();
  const nextYear = currentYear + 1;
  const year = month >= currentMonth ? currentYear : nextYear;

  return (
    <MonthItemContainer>
      <MonthText
        fontSize={2}
        semiBold
        marginBottom={0}
        backgroundColor={MONTH_COLORS[month]}
        color={colors[MONTH_TEXT_COLORS[month]]}
      >
        {monthText} {year}
      </MonthText>
      {dayItems}
    </MonthItemContainer>
  );
};
