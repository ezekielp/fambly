import React, { FC, useState } from 'react';
import { AmorousPartnerForm } from './AmorousPartnerForm';
import {
  SubContactInfoFragment,
  useGetAmorousRelationshipQuery,
} from 'client/graphqlTypes';
import { FieldBadge } from 'client/common/FieldBadge';
import { StyledLink } from 'client/common/StyledLink';
import { Modal } from 'client/common/Modal';
import { colors } from 'client/shared/styles';
import { Dropdown } from 'client/common/Dropdown';
import { Text } from 'client/common/Text';
import { Button } from 'client/common/Button';
import { gql } from '@apollo/client';
import {
  StyledProfileFieldContainer,
  FlexContainer,
  AgeContainer,
} from 'client/profiles/parent_child/ParentItem';
import { getLastNameContent, MONTH_ABBREVIATIONS } from 'client/profiles/utils';
import {
  getPartnerTypeText,
  partnerTypeColors,
  relationshipDatesColors,
} from './utils';

gql`
  query GetAmorousRelationship($input: AmorousRelationshipInput!) {
    amorousRelationshipByPartnerIds(input: $input) {
      id
      current
      relationshipType
      startYear
      startMonth
      startDay
      weddingYear
      weddingMonth
      weddingDay
      endYear
      endMonth
      endDay
      notes {
        id
        content
      }
    }
  }
`;

interface AmorousPartnerItemProps {
  partner: SubContactInfoFragment;
  otherPartnerLastName?: string | null | undefined;
  otherPartnerId: string;
  relations: SubContactInfoFragment[];
}

export const PartnerItem: FC<PartnerItemProps> = ({
  partner,
  otherPartnerLastName,
  otherPartnerId,
  relations,
}) => {
  const { id, firstName, lastName, age, gender } = partner;
  const { data: amorousRelationshipData } = useGetAmorousRelationshipQuery({
    variables: {
      input: {
        partnerOneId: otherPartnerId,
        partnerTwoId: id,
      },
    },
  });
  if (!amorousRelationshipData?.amorousRelationshipByPartnerIds) return null;
  const {
    id,
    current,
    relationshipType,
    startYear,
    startMonth,
    startDay,
    weddingYear,
    weddingMonth,
    weddingDay,
    endYear,
    endMonth,
    endDay,
  } = amorousRelationshipData.amorousRelationshipByPartnerIds;

  const [editFlag, setEditFlag] = useState(false);
  const [deletedFlag, setDeletedFlag] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const ageContent = age ? <AgeContainer>{`(${age})`}</AgeContainer> : '';

  const getDateText = (
    year: number | null | undefined,
    month: string,
    day: string,
  ): string => {
    if (year && month && !day) {
      return `${MONTH_ABBREVIATIONS[month]} ${year}`;
    } else if (year && !month && !day) {
      return `${year}`;
    } else if (month && day && !year) {
      return `${MONTH_ABBREVIATIONS[month]} ${day}`;
    } else if (month && day && year) {
      return `${MONTH_ABBREVIATIONS[month]} ${day}, ${year}`;
    } else {
      return '';
    }
  };

  // const month = birthMonth ? birthMonth.toString() : '';
  // const day = birthDay ? birthDay.toString() : '';

  return (
    <>
      {!deletedFlag && (
        <>
          <StyledProfileFieldContainer>
            <FlexContainer>
              <StyledLink to={`/profiles/${id}`}>
                {firstName}
                {getLastNameContent(lastName, otherPartnerLastName)}
              </StyledLink>
              {ageContent}
            </FlexContainer>
            {relationshipType && (
              <FieldBadge
                backgroundColor={
                  partnerTypeColors[relationshipType]['backgroundColor']
                }
                textColor={
                  partnerTypeColors[relationshipType]['backgroundColor']
                }
              >
                {getPartnerTypeText(relationshipType, gender, current)}
              </FieldBadge>
            )}
          </StyledProfileFieldContainer>
        </>
      )}
    </>
  );
};
