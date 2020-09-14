import React, { FC, useState } from 'react';
import { useDeletePersonPlaceMutation } from 'client/graphqlTypes';
import { Dropdown } from 'client/common/Dropdown';
import { ProfileFieldContainer } from 'client/common/ProfileFieldContainer';
import { PersonPlaceInfoFragment } from 'client/graphqlTypes';
import { PersonPlaceForm } from './PersonPlaceForm';
import { NoteItem } from 'client/profiles/notes/NoteItem';
import { gql } from '@apollo/client';
import { colors } from 'client/shared/styles';
import { Modal } from 'client/common/Modal';
import { Text } from 'client/common/Text';
import { Button } from 'client/common/Button';
import styled from 'styled-components';

gql`
  mutation DeletePersonPlace($input: DeletePersonPlaceInput!) {
    deletePersonPlace(input: $input)
  }
`;

const PersonPlaceTextContainer = styled.div`
  text-align: center;
  margin-right: 10px;
`;

interface PersonPlaceItemProps {
  personPlace: PersonPlaceInfoFragment;
}

export const PersonPlaceItem: FC<PersonPlaceItemProps> = ({ personPlace }) => {
  const {
    id,
    place,
    person,
    birthPlace,
    startMonth,
    startYear,
    endMonth,
    endYear,
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

  const getTimingText = () => {
    const startMonthText = startMonth ? startMonth : '';
    const endMonthText = endMonth ? endMonth + ' ' : ' ';
    if (startYear && endYear) {
      return (
        <div>
          ({startMonthText} {startYear}-{endMonthText}
          {endYear})
        </div>
      );
    } else if (startYear) {
      return <div>({startYear}-)</div>;
    } else if (endYear) {
      return <div>(until {endYear})</div>;
    }
    return <></>;
  };

  const dropdownItems = [
    { label: 'Edit', onClick: () => setEditFlag(true) },
    { label: 'Delete', onClick: () => setModalOpen(true) },
  ];

  const initialValues = {
    country,
    stateOrRegion: stateOrRegion ? stateOrRegion : '',
    town: town ? town : '',
    street: street ? street : '',
    zipCode: zipCode ? zipCode : '',
    birthPlace: birthPlace ? ['birthPlace'] : [],
    startYear,
    startMonth: startMonth ? startMonth.toString() : '',
    endYear,
    endMonth: endMonth ? endMonth.toString() : '',
  };

  const noteItems =
    notes && notes.map((note) => <NoteItem note={note} key={note.id} />);

  const personPlaceContent = (
    <PersonPlaceTextContainer>
      {getTimingText()}
      <div>{street && street}</div>
      <div>
        {town && town}
        {stateOrRegion && `, ${stateOrRegion}`} {zipCode && zipCode}
      </div>
      <div>{country}</div>
    </PersonPlaceTextContainer>
  );

  return editFlag ? (
    <PersonPlaceForm
      initialValues={initialValues}
      setEditFlag={setEditFlag}
      personId={person.id}
    />
  ) : (
    <>
      {!deletedFlag && (
        <>
          <ProfileFieldContainer>
            {personPlaceContent}
            <Dropdown
              menuItems={dropdownItems}
              xMarkSize="20"
              sandwichSize="20"
              color={colors.orange}
              topSpacing="30px"
            />
          </ProfileFieldContainer>
          {!deletedFlag && noteItems}
        </>
      )}
      {modalOpen && (
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
  );
};
