import React, { FC } from 'react';
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
  return (
    <MonthItemContainer>
      <Text fontSize={3} semiBold>
        {MONTHS[month]}
      </Text>
    </MonthItemContainer>
  );
};
