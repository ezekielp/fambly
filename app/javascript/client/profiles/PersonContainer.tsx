import React, { FC, useState, useEffect } from 'react';
import {
  useGetPersonForPersonContainerQuery,
  PersonInfoFragmentDoc,
  SubContactInfoFragmentDoc,
  PersonPlaceInfoFragmentDoc,
} from 'client/graphqlTypes';
import { AgeForm } from './age/AgeForm';
import { AgeContainer } from './age/AgeContainer';
import { GenderForm } from './gender/GenderForm';
import { GenderContainer } from './gender/GenderContainer';
import { NoteForm } from './notes/NoteForm';
import { NotesContainer } from './notes/NotesContainer';
import { BirthdateForm } from './birthdate/BirthdateForm';
import { BirthdateContainer } from './birthdate/BirthdateContainer';
import { ParentForm } from './parent_child/ParentForm';
import { ChildForm } from './parent_child/ChildForm';
import { ParentsContainer } from './parent_child/ParentsContainer';
import { ChildrenContainer } from './parent_child/ChildrenContainer';
import { PersonPlaceForm } from './person_place/PersonPlaceForm';
import { PersonPlacesContainer } from './person_place/PersonPlacesContainer';
import { PersonFieldsInput } from './PersonFieldsInput';
import { StyledLink } from 'client/common/StyledLink';
import { Modal } from 'client/common/Modal';
import { useParams } from 'react-router-dom';
import { gql } from '@apollo/client';
import { BelowNavContainer } from 'client/common/BelowNavContainer';
import { text, spacing, colors } from 'client/shared/styles';
import styled from 'styled-components';

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
    gender
    age
    monthsOld
    birthYear
    birthMonth
    birthDay
    notes {
      id
      content
    }
    parents {
      ...SubContactInfo
    }
    children {
      ...SubContactInfo
    }
    personPlaces {
      ...PersonPlaceInfo
    }
  }

  ${SubContactInfoFragmentDoc}
  ${PersonPlaceInfoFragmentDoc}
`;

gql`
  fragment SubContactInfo on Person {
    id
    firstName
    lastName
    age
    monthsOld
  }
`;

gql`
  fragment PersonPlaceInfo on PersonPlace {
    id
    place {
      id
      country
      stateOrRegion
      town
      street
      zipCode
    }
    person {
      id
      firstName
    }
    birthPlace
    current
    startMonth
    startYear
    endMonth
    endYear
    notes {
      id
      content
    }
  }
`;

const BackToPeopleLinkContainer = styled.div`
  margin-bottom: ${spacing[2]};
`;

const ProfileHeader = styled.h1`
  font-size: ${text[4]};
  font-weight: 700;
  margin-bottom: ${spacing[2]};
`;

export const Subheading = styled.div`
  font-size: ${text[3]};
  margin-bottom: ${spacing[2]};
`;

export const SectionDivider = styled.hr`
  height: 1px;
  border: none;
  background-color: ${colors.lightGray};
  margin: ${spacing[3]} 0;
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
    setFieldToAdd('');
  }, []);

  useEffect(() => {
    refetchPersonData();
  }, [fieldToAdd]);

  if (!personData) return null;
  if (!personData.personById) return null;
  const {
    firstName,
    lastName,
    age,
    gender,
    monthsOld,
    birthYear,
    birthMonth,
    birthDay,
    notes,
    parents,
    children,
    personPlaces,
  } = personData.personById;

  const hasAge = age || monthsOld;
  const hasBirthdate = birthYear || birthMonth;
  const hasFullBirthdate = birthYear && birthMonth && birthDay ? true : false;
  const hasVitals = gender || hasAge || hasBirthdate;
  const hasFamily =
    (parents && parents.length > 0) || (children && children.length > 0);
  const hasPersonalHistory = personPlaces && personPlaces.length > 0;

  return (
    <BelowNavContainer>
      <BackToPeopleLinkContainer>
        <StyledLink to="/home">Back to people</StyledLink>
      </BackToPeopleLinkContainer>
      <ProfileHeader>
        {firstName} {lastName && ` ${lastName}`}
      </ProfileHeader>
      <PersonFieldsInput
        personData={personData.personById}
        fieldToAdd={fieldToAdd}
        onChange={(e) => setFieldToAdd(e.target.value)}
      />
      {fieldToAdd === 'age' && (
        <Modal setFieldToAdd={setFieldToAdd}>
          <AgeForm setFieldToAdd={setFieldToAdd} personId={personId} />
        </Modal>
      )}
      {fieldToAdd === 'birthdate' && (
        <Modal setFieldToAdd={setFieldToAdd}>
          <BirthdateForm setFieldToAdd={setFieldToAdd} personId={personId} />
        </Modal>
      )}
      {fieldToAdd === 'gender' && (
        <Modal setFieldToAdd={setFieldToAdd}>
          <GenderForm setFieldToAdd={setFieldToAdd} personId={personId} />
        </Modal>
      )}
      {fieldToAdd === 'note' && (
        <Modal setFieldToAdd={setFieldToAdd}>
          <NoteForm setFieldToAdd={setFieldToAdd} personId={personId} />
        </Modal>
      )}
      {fieldToAdd === 'parent' && (
        <Modal setFieldToAdd={setFieldToAdd}>
          <ParentForm
            setFieldToAdd={setFieldToAdd}
            childId={personId}
            personFirstName={firstName}
          />
        </Modal>
      )}
      {fieldToAdd === 'child' && (
        <Modal setFieldToAdd={setFieldToAdd}>
          <ChildForm
            setFieldToAdd={setFieldToAdd}
            parentId={personId}
            personFirstName={firstName}
          />
        </Modal>
      )}
      {fieldToAdd === 'personPlace' && (
        <Modal setFieldToAdd={setFieldToAdd}>
          <PersonPlaceForm setFieldToAdd={setFieldToAdd} personId={personId} />
        </Modal>
      )}
      {notes && notes.length > 0 && (
        <>
          <SectionDivider />
          <Subheading>Notes</Subheading>
          <NotesContainer notes={notes} />
        </>
      )}
      {hasVitals && <SectionDivider />}
      {gender && <GenderContainer gender={gender} personId={personId} />}
      {hasAge && (
        <AgeContainer
          age={age}
          monthsOld={monthsOld}
          personId={personId}
          hasFullBirthdate={hasFullBirthdate}
        />
      )}
      {hasBirthdate && (
        <BirthdateContainer
          birthYear={birthYear}
          birthMonth={birthMonth}
          birthDay={birthDay}
          personId={personId}
        />
      )}
      {hasFamily && (
        <>
          <SectionDivider />
          <Subheading>Family</Subheading>
        </>
      )}
      {parents && parents.length > 0 && (
        <ParentsContainer
          parents={parents}
          childId={personId}
          childLastName={lastName}
        />
      )}
      {children && children.length > 0 && (
        <ChildrenContainer
          actualChildren={children}
          parentId={personId}
          parentLastName={lastName}
        />
      )}
      {hasPersonalHistory && (
        <>
          <SectionDivider />
          <Subheading>Personal history</Subheading>
        </>
      )}
      {personPlaces && personPlaces.length > 0 && (
        <PersonPlacesContainer
          personPlaces={personPlaces}
          firstName={firstName}
        />
      )}
    </BelowNavContainer>
  );
};
