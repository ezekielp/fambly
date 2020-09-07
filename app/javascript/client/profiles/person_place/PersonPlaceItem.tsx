import React, { FC, useState } from 'react';
import { useDeletePersonPlaceMutation } from 'client/graphqlTypes';
import { PersonPlaceInfoFragment } from 'client/graphqlTypes';
import { PersonPlaceForm } from './PersonPlaceForm';
import { NoteItem } from 'client/profiles/notes/NoteItem';
import { gql } from '@apollo/client';

gql`
  mutation DeletePersonPlace($input: DeletePersonPlaceInput!) {
    deletePersonPlace(input: $input)
  }
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

  const deletePersonPlace = async () => {
    await deletePersonPlaceMutation({
      variables: {
        input: {
          personPlaceId: id,
        },
      },
    });
    setDeletedFlag(true);
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

  const editAndDeleteButtons = (
    <>
      <button onClick={() => setEditFlag(true)}>Edit</button>
      <button onClick={() => deletePersonPlace()}>Delete</button>
    </>
  );

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
    <>
      {getTimingText()}
      <div>{street && street}</div>
      <div>
        {town && town}, {stateOrRegion && stateOrRegion} {zipCode && zipCode}
      </div>
      <div>{country}</div>
    </>
  );

  return editFlag ? (
    <PersonPlaceForm
      initialValues={initialValues}
      setEditFlag={setEditFlag}
      personId={person.id}
    />
  ) : (
    <>
      {!deletedFlag && personPlaceContent}
      {!deletedFlag && editAndDeleteButtons}
      {!deletedFlag && noteItems}
    </>
  );
};
