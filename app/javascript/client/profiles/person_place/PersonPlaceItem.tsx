import React, { FC, useState } from 'react';
import { useDeletePersonPlaceMutation } from 'client/graphqlTypes';
import { Dropdown } from 'client/common/Dropdown';
import { ProfileFieldContainer } from 'client/common/ProfileFieldContainer';
import { PersonPlaceInfoFragment } from 'client/graphqlTypes';
import { PersonPlaceForm } from './PersonPlaceForm';
import { NoteItem } from 'client/profiles/notes/NoteItem';
import { gql } from '@apollo/client';
import { colors, spacing } from 'client/shared/styles';
import { Modal } from 'client/common/Modal';
import { Text } from 'client/common/Text';
import { Button } from 'client/common/Button';
import styled from 'styled-components';
import { MONTH_ABBREVIATIONS } from 'client/profiles/utils';
import { FieldBadge } from 'client/common/FieldBadge';
import { placeTypeColors, getPlaceTypeLabel } from './utils';

gql`
  mutation DeletePersonPlace($input: DeletePersonPlaceInput!) {
    deletePersonPlace(input: $input)
  }
`;

const PersonPlaceItemContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  &:not(:last-child) {
    margin-bottom: ${spacing[2]};
  }
`;

const PersonPlaceTextContainer = styled.div`
  text-align: center;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CountryContainer = styled.div`
  margin-bottom: 5px;
`;

interface PersonPlaceItemProps {
  personPlace: PersonPlaceInfoFragment;
  current: boolean;
  personFirstName: string;
}

export const PersonPlaceItem: FC<PersonPlaceItemProps> = ({
  personPlace,
  current,
  personFirstName,
}) => {
  const {
    id,
    place,
    person,
    startMonth,
    startYear,
    endMonth,
    endYear,
    placeType,
    notes,
  } = personPlace;
  const { country, stateOrRegion, town, street, zipCode } = place;

  const [deletePersonPlaceMutation] = useDeletePersonPlaceMutation();
  const [editFlag, setEditFlag] = useState(false);
  const [deletedFlag, setDeletedFlag] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const deletePersonPlace = async () => {
    await deletePersonPlaceMutation({
      variables: {
        input: {
          personPlaceId: id,
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
    setModalOpen(false);
    setEditFlag(false);
  };

  const getStartAndEndDatesText = (
    startYear: number | null | undefined,
    startMonth: number | null | undefined,
    endYear: number | null | undefined,
    endMonth: number | null | undefined,
    current: boolean,
  ) => {
    const startMonthText = startMonth
      ? MONTH_ABBREVIATIONS[startMonth] + ' '
      : '';
    const endMonthText = endMonth ? MONTH_ABBREVIATIONS[endMonth] + ' ' : ' ';
    if (startYear && endYear) {
      return `${startMonthText} ${startYear}-${endMonthText}
          ${endYear}`;
    } else if (startYear) {
      if (current) {
        return `${startMonthText}${startYear} - present`;
      } else {
        return `${startMonthText}${startYear} - unknown`;
      }
    } else if (endYear) {
      if (current) {
        return `until ${endMonthText}${endYear}`;
      } else {
        return `? - ${endMonthText}${endYear}`;
      }
    }
    return '';
  };

  const startAndEndDates = getStartAndEndDatesText(
    startYear,
    startMonth,
    endYear,
    endMonth,
    current,
  );

  const dropdownItems = [
    { label: 'Edit', onClick: handleEdit },
    { label: 'Delete', onClick: () => setModalOpen(true) },
  ];

  const editFormInitialValues = {
    country,
    placeType: placeType ? placeType : '',
    stateOrRegion: stateOrRegion ? stateOrRegion : '',
    town: town ? town : '',
    street: street ? street : '',
    zipCode: zipCode ? zipCode : '',
    startYear,
    startMonth: startMonth ? startMonth.toString() : '',
    endYear,
    endMonth: endMonth ? endMonth.toString() : '',
    current: current ? ['current'] : [],
  };

  const noteItems =
    notes && notes.map((note) => <NoteItem note={note} key={note.id} />);

  const personPlaceContent = (
    <PersonPlaceTextContainer>
      {placeType && (
        <FieldBadge
          backgroundColor={placeTypeColors[placeType]['backgroundColor']}
          textColor={placeTypeColors[placeType]['textColor']}
          marginBottom="5px"
          marginRight="0"
        >
          {getPlaceTypeLabel(placeType)}
        </FieldBadge>
      )}
      <div>{street && street}</div>
      <div>
        {town && town}
        {stateOrRegion && `, ${stateOrRegion}`} {zipCode && zipCode}
      </div>
      <CountryContainer>{country}</CountryContainer>
      {startAndEndDates && (
        <FieldBadge backgroundColor="white" textColor="black" marginRight="0">
          {startAndEndDates}
        </FieldBadge>
      )}
    </PersonPlaceTextContainer>
  );

  return modalOpen ? (
    <>
      {editFlag && (
        <Modal onClose={handleEditModalClose}>
          <PersonPlaceForm
            initialValues={editFormInitialValues}
            setEditFlag={setEditFlag}
            personId={person.id}
            setModalOpen={setModalOpen}
            personPlaceId={id}
            personFirstName={personFirstName}
          />
        </Modal>
      )}
      {!editFlag && (
        <Modal onClose={() => setModalOpen(false)}>
          <Text marginBottom={3} fontSize={3} bold>
            Are you sure you want to delete this field?
          </Text>
          <Button marginRight="1rem" onClick={() => deletePersonPlace()}>
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
          <PersonPlaceItemContainer>
            {personPlaceContent}
            <Dropdown
              menuItems={dropdownItems}
              xMarkSize="20"
              sandwichSize="20"
              color={colors.orange}
              topSpacing="30px"
            />
          </PersonPlaceItemContainer>
          {!deletedFlag && noteItems}
        </>
      )}
    </>
  );
};
