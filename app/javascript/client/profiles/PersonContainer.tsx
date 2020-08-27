import React, { FC, useState, useEffect } from 'react';
import { useGetPersonForPersonContainerQuery } from 'client/graphqlTypes';
import { AddNoteForm } from 'client/form/AddNoteForm';
import { useParams } from 'react-router-dom';
import { gql } from '@apollo/client';

gql`
  query GetPersonForPersonContainer($personId: String!) {
    personById(personId: $personId) {
      id
      firstName
      lastName
      notes {
        id
        content
      }
    }
  }
`;

interface PersonContainerProps {}

export const PersonContainer: FC = () => {
  const [fieldToAdd, setFieldToAdd] = useState('');
  const { personId } = useParams();

  const {
    data: personData,
    refetch: refetchPersonData,
  } = useGetPersonForPersonContainerQuery({
    variables: { personId },
  });

  useEffect(() => {
    refetchPersonData();
  }, [fieldToAdd]);

  if (!personData) return null;
  if (!personData.personById) return null;
  const { firstName, lastName, notes } = personData.personById;

  // To do: Create a separate display component, of course, for these and every such thing as this, that you just pass the data to as a prop
  const displayedNotes = notes?.map((note) => (
    <div key={note.id}>{note.content}</div>
  ));

  return (
    <>
      <h1>
        {firstName} {lastName && ` ${lastName}`}
      </h1>
      <select
        value={fieldToAdd}
        onChange={(e) => setFieldToAdd(e.target.value)}
      >
        <option value=""></option>
        <option value="note">Note</option>
      </select>
      {fieldToAdd === 'note' && (
        <AddNoteForm setFieldToAdd={setFieldToAdd} personId={personId} />
      )}
      {notes && displayedNotes}
    </>
  );
};
