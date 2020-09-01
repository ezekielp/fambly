import React, { FC, useState, useEffect } from 'react';
import {
  useGetPersonForPersonContainerQuery,
  PersonInfoFragmentDoc,
} from 'client/graphqlTypes';
import { AgeForm } from './age/AgeForm';
import { AgeContainer } from './age/AgeContainer';
import { NoteForm } from './notes/NoteForm';
import { NotesContainer } from './notes/NotesContainer';
import { BirthdateForm } from './birthdate/BirthdateForm';
import { BirthdateContainer } from './birthdate/BirthdateContainer';
import { ParentChildForm } from './parent_child/ParentChildForm';
import { PersonFieldsInput } from './PersonFieldsInput';
import { useParams } from 'react-router-dom';
import { gql } from '@apollo/client';

gql`
  query GetPersonForPersonContainer($personId: String!) {
    personById(personId: $personId) {
      ...PersonInfo
    }
  }

  ${PersonInfoFragmentDoc}
`;

gql`
  fragment PersonInfo on Person {
    id
    firstName
    lastName
    age
    monthsOld
    birthYear
    birthMonth
    birthDay
    notes {
      id
      content
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
  const {
    firstName,
    lastName,
    age,
    monthsOld,
    birthYear,
    birthMonth,
    birthDay,
    notes,
  } = personData.personById;
  const ageFlag = age || monthsOld;
  const birthdateFlag = birthYear || birthMonth;

  return (
    <>
      <h1>
        {firstName} {lastName && ` ${lastName}`}
      </h1>
      <PersonFieldsInput
        personData={personData.personById}
        fieldToAdd={fieldToAdd}
        onChange={(e) => setFieldToAdd(e.target.value)}
      />
      {fieldToAdd === 'age' && (
        <AgeForm setFieldToAdd={setFieldToAdd} personId={personId} />
      )}
      {fieldToAdd === 'birthdate' && (
        <BirthdateForm setFieldToAdd={setFieldToAdd} personId={personId} />
      )}
      {fieldToAdd === 'note' && (
        <NoteForm setFieldToAdd={setFieldToAdd} personId={personId} />
      )}
      {fieldToAdd === 'parent' && (
        <ParentChildForm
          setFieldToAdd={setFieldToAdd}
          childId={personId}
          personFirstName={firstName}
        />
      )}
      {fieldToAdd === 'child' && (
        <ParentChildForm
          setFieldToAdd={setFieldToAdd}
          parentId={personId}
          personFirstName={firstName}
        />
      )}
      {ageFlag && (
        <AgeContainer age={age} monthsOld={monthsOld} personId={personId} />
      )}
      {birthdateFlag && (
        <BirthdateContainer
          birthYear={birthYear}
          birthMonth={birthMonth}
          birthDay={birthDay}
          personId={personId}
        />
      )}
      {notes && <NotesContainer notes={notes} />}
    </>
  );
};
