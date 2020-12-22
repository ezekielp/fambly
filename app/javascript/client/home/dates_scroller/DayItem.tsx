import React, { FC } from 'react';
import { PeopleAndCouplesInfoForDatesScroller } from 'client/home/utils';
import { addSuffixToNumber } from './utils';
import { StyledLink } from 'client/common/StyledLink';
import styled from 'styled-components';

const DayItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-left: 5px;
`;

const DayContainer = styled.div``;

const DatesContainer = styled.div``;

const DateContainer = styled.div`
  margin-left: 5px;
`;

interface DayItemProps {
  day: number;
  peopleAndCouplesInfo: PeopleAndCouplesInfoForDatesScroller;
  year: number;
}

export const DayItem: FC<DayItemProps> = ({
  day,
  peopleAndCouplesInfo,
  year,
}) => {
  const birthdays = peopleAndCouplesInfo.people?.map((person) => {
    const { id, firstName, lastName, age, monthsOld } = person;

    const nameText = lastName ? `${firstName} ${lastName}` : `${firstName}`;

    const getUpcomingAgeText = () => {
      if (monthsOld) {
        return addSuffixToNumber(Math.floor(monthsOld / 12) + 1);
      } else if (age) {
        return addSuffixToNumber(age + 1);
      }
      return '';
    };

    return (
      <DateContainer key={id}>
        <StyledLink to={`/profiles/${id}`}>{nameText}</StyledLink>&apos;s{' '}
        {getUpcomingAgeText()} birthday
      </DateContainer>
    );
  });

  const anniversaries = peopleAndCouplesInfo.couples?.map((couple) => {
    const {
      partnerOneId,
      partnerTwoId,
      partnerOneName,
      partnerTwoName,
      weddingYear,
    } = couple;

    const anniversaryYear = weddingYear
      ? `${addSuffixToNumber(year - weddingYear)} `
      : '';

    return (
      <DateContainer key={partnerOneId + partnerTwoId}>
        <StyledLink to={`/profiles/${partnerOneId}`}>
          {partnerOneName}
        </StyledLink>{' '}
        and{' '}
        <StyledLink to={`/profiles/${partnerTwoId}`}>
          {partnerTwoName}
        </StyledLink>
        &apos;s {anniversaryYear} anniversary
      </DateContainer>
    );
  });

  return (
    <DayItemContainer>
      <DayContainer>{day}</DayContainer>
      <DatesContainer>
        {birthdays}
        {anniversaries}
      </DatesContainer>
    </DayItemContainer>
  );
};
