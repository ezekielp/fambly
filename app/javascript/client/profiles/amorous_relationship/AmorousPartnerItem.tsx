import React, { FC, useState } from 'react';
import { AmorousPartnerForm } from './AmorousPartnerForm';
import {
  SubContactInfoFragment,
  useGetAmorousRelationshipQuery,
  useDeleteAmorousRelationshipMutation,
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

gql`
  mutation DeleteAmorousRelationship($input: DeleteAmorousRelationshipInput!) {
    deleteAmorousRelationship(input: $input)
  }
`;

interface AmorousPartnerItemProps {
  partner: SubContactInfoFragment;
  otherPartnerLastName?: string | null | undefined;
  otherPartnerId: string;
  relations: SubContactInfoFragment[];
}

export const AmorousPartnerItem: FC<AmorousPartnerItemProps> = ({
  partner,
  otherPartnerLastName,
  otherPartnerId,
  relations,
}) => {
  const [editFlag, setEditFlag] = useState(false);
  const [deletedFlag, setDeletedFlag] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { id: amorousPartnerId, firstName, lastName, age, gender } = partner;
  const { data: amorousRelationshipData } = useGetAmorousRelationshipQuery({
    variables: {
      input: {
        partnerOneId: otherPartnerId,
        partnerTwoId: amorousPartnerId,
      },
    },
  });
  const [
    deleteAmorousRelationshipMutation,
  ] = useDeleteAmorousRelationshipMutation();

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

  const deleteAmorousRelationship = async () => {
    await deleteAmorousRelationshipMutation({
      variables: {
        input: {
          partnerOneId: otherPartnerId,
          partnerTwoId: amorousPartnerId,
        },
      },
    });
    setDeletedFlag(true);
    setModalOpen(false);
  };

  const handleEdit = () => {
    setEditFlag(true);
    setModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditFlag(false);
    setModalOpen(false);
  };

  const dropdownItems = [
    { label: 'Edit', onClick: handleEdit },
    { label: 'Delete', onClick: () => setModalOpen(true) },
  ];

  const ageContent = age ? <AgeContainer>{`(${age})`}</AgeContainer> : '';

  const getDateText = (
    year: number | null | undefined,
    month: number | null | undefined,
    day: number | null | undefined,
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

  const anniversaryDateText = getDateText(
    weddingYear,
    weddingMonth,
    weddingDay,
  );

  const getStartAndEndDatesText = (
    startYear: number | null | undefined,
    startMonth: number | null | undefined,
    startDay: number | null | undefined,
    endYear: number | null | undefined,
    endMonth: number | null | undefined,
    endDay: number | null | undefined,
    current: boolean,
  ): string => {
    const startDateText = getDateText(startYear, startMonth, startDay);
    const endDateText = getDateText(endYear, endMonth, endDay);
    if (startDateText && endDateText) {
      return `${startDateText} - ${endDateText}`;
    } else if (startDateText) {
      if (current) {
        return `${startDateText} - present`;
      } else {
        return `${startDateText} - ?`;
      }
    } else if (endDateText) {
      return `? - ${endDateText}`;
    } else {
      return '';
    }
  };

  const startAndEndDatesText = getStartAndEndDatesText(
    startYear,
    startMonth,
    startDay,
    endYear,
    endMonth,
    endDay,
    current,
  );

  const editFormInitialValues = {
    formPartnerId: amorousPartnerId,
    newOrCurrentContact: 'current_person',
    formRelationshipType: relationshipType ? relationshipType : '',
    current: current ? ['current'] : [],
    showOnDashboard: [],
    startYear,
    startMonth: startMonth ? startMonth.toString() : '',
    startDay: startDay ? startDay.toString() : '',
    weddingYear,
    weddingMonth: weddingMonth ? weddingMonth.toString() : '',
    weddingDay: weddingDay ? weddingDay.toString() : '',
    endYear,
    endMonth: endMonth ? endMonth.toString() : '',
    endDay: endDay ? endDay.toString() : '',
  };

  return modalOpen ? (
    <>
      {editFlag && (
        <Modal onClose={handleEditModalClose}>
          <AmorousPartnerForm
            initialValues={editFormInitialValues}
            partnerOneId={otherPartnerId}
            setEditFlag={setEditFlag}
            setModalOpen={setModalOpen}
            relations={relations}
            propRelationshipType={relationshipType ? relationshipType : ''}
          />
        </Modal>
      )}
      {!editFlag && (
        <Modal onClose={() => setModalOpen(false)}>
          <Text marginBottom={3} fontSize={3} bold>
            Are you sure you want to delete this field?
          </Text>
          <Button
            marginRight="1rem"
            onClick={() => deleteAmorousRelationship()}
          >
            Yes
          </Button>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
        </Modal>
      )}
    </>
  ) : (
    <>
      {!deletedFlag && (
        <>
          <StyledProfileFieldContainer>
            <FlexContainer>
              <StyledLink to={`/profiles/${amorousPartnerId}`}>
                {firstName}
                {getLastNameContent(lastName, otherPartnerLastName)}
              </StyledLink>
              {ageContent}
            </FlexContainer>
            <div>
              {relationshipType && (
                <FieldBadge
                  backgroundColor={
                    partnerTypeColors[relationshipType]['backgroundColor']
                  }
                  textColor={partnerTypeColors[relationshipType]['textColor']}
                  marginBottom={
                    anniversaryDateText || startAndEndDatesText ? '5px' : '0'
                  }
                >
                  {getPartnerTypeText(relationshipType, gender, current)}
                </FieldBadge>
              )}
              {anniversaryDateText && (
                <FieldBadge
                  backgroundColor={
                    relationshipDatesColors['anniversary']['backgroundColor']
                  }
                  textColor={
                    relationshipDatesColors['anniversary']['textColor']
                  }
                  marginBottom={startAndEndDatesText ? '5px' : '0'}
                >
                  anniversary: {anniversaryDateText}
                </FieldBadge>
              )}
              {startAndEndDatesText && (
                <FieldBadge
                  backgroundColor={
                    relationshipDatesColors['startAndEndDates'][
                      'backgroundColor'
                    ]
                  }
                  textColor={
                    relationshipDatesColors['startAndEndDates']['textColor']
                  }
                >
                  {startAndEndDatesText}
                </FieldBadge>
              )}
            </div>
            <Dropdown
              menuItems={dropdownItems}
              xMarkSize="15"
              sandwichSize="20"
              color={colors.orange}
              topSpacing="30px"
            />
          </StyledProfileFieldContainer>
        </>
      )}
    </>
  );
};
