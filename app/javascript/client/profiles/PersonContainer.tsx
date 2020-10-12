import React, { FC, useState, useEffect } from 'react';
import {
  useGetPersonForPersonContainerQuery,
  PersonInfoFragmentDoc,
  SubContactInfoFragmentDoc,
  PersonPlaceInfoFragmentDoc,
  useDeletePersonMutation,
} from 'client/graphqlTypes';
import { TagsContainer } from 'client/profiles/tags/TagsContainer';
import { PersonForm } from './PersonForm';
import { MiddleNameContainer } from './names/MiddleNameContainer';
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
import { SiblingForm } from './sibling/SiblingForm';
import { ParentsContainer } from './parent_child/ParentsContainer';
import { ChildrenContainer } from './parent_child/ChildrenContainer';
import { SiblingsContainer } from './sibling/SiblingsContainer';
import { PersonPlaceForm } from './person_place/PersonPlaceForm';
import { PersonPlacesContainer } from './person_place/PersonPlacesContainer';
import { PersonFieldsInput } from './PersonFieldsInput';
import { StyledLink } from 'client/common/StyledLink';
import { Modal } from 'client/common/Modal';
import { useParams } from 'react-router-dom';
import { gql } from '@apollo/client';
import { BelowNavContainer } from 'client/common/BelowNavContainer';
import { text, spacing, colors } from 'client/shared/styles';
import { Dropdown } from 'client/common/Dropdown';
import styled from 'styled-components';
import { Text } from 'client/common/Text';
import { Button } from 'client/common/Button';
import { withRouter, RouteComponentProps } from 'react-router-dom';

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
    middleName
    lastName
    gender
    age
    monthsOld
    birthYear
    birthMonth
    birthDay
    tags {
      id
      name
      color
    }
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
    siblings {
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
    gender
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

gql`
  mutation DeletePerson($input: DeletePersonInput!) {
    deletePerson(input: $input)
  }
`;

const BackToPeopleLinkContainer = styled.div`
  margin-bottom: ${spacing[2]};
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const ProfileHeader = styled.h1`
  font-size: ${text[4]};
  font-variation-settings: 'wght' 700;
  margin-bottom: ${spacing[2]};
  margin-right: 1rem;
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

interface PersonContainerProps extends RouteComponentProps {}

const InternalPersonContainer: FC<PersonContainerProps> = ({ history }) => {
  const [deletePersonMutation] = useDeletePersonMutation();
  const [fieldToAdd, setFieldToAdd] = useState<string>('');
  const [editNameFlag, setEditNameFlag] = useState<boolean>(false);
  const [
    deletePersonConfirmationFlag,
    setDeletePersonConfirmationFlag,
  ] = useState<boolean>(false);
  const { personId } = useParams();

  useEffect(() => {
    setFieldToAdd('');
  }, []);

  useEffect(() => {
    refetchPersonData();
  }, [fieldToAdd]);

  const deletePerson = async () => {
    await deletePersonMutation({
      variables: {
        input: {
          personId,
        },
      },
    });
    history.push('/home');
  };

  const dropdownItems = [
    {
      label: 'Delete profile',
      onClick: () => setDeletePersonConfirmationFlag(true),
    },
  ];

  const {
    data: personData,
    refetch: refetchPersonData,
  } = useGetPersonForPersonContainerQuery({
    variables: { personId },
  });

  if (!personData) return null;
  // if (!personData.personById) return null;
  if (!personData.personById) {
    history.push('/home');
    return null;
  }
  const {
    firstName,
    middleName,
    lastName,
    age,
    gender,
    monthsOld,
    birthYear,
    birthMonth,
    birthDay,
    tags,
    notes,
    parents,
    children,
    siblings,
    personPlaces,
  } = personData.personById;

  const hasAge = age || monthsOld;
  const hasBirthdate = birthYear || birthMonth;
  const hasVitals = gender || hasAge || hasBirthdate;
  const hasFamily =
    (parents && parents.length > 0) ||
    (children && children.length > 0) ||
    (siblings && siblings.length > 0);
  const hasPersonalHistory = personPlaces && personPlaces.length > 0;

  return (
    <BelowNavContainer>
      <BackToPeopleLinkContainer>
        <StyledLink to="/home">Back to dashboard</StyledLink>
      </BackToPeopleLinkContainer>
      <HeaderContainer>
        <ProfileHeader>
          {firstName} {lastName && ` ${lastName}`}
        </ProfileHeader>
        <Dropdown color={colors.orange} menuItems={dropdownItems} />
      </HeaderContainer>
      {deletePersonConfirmationFlag && (
        <Modal onClose={() => setDeletePersonConfirmationFlag(false)}>
          <Text marginBottom={3} fontSize={3} bold>
            Are you sure you want to delete this profile? You can&#39;t undo
            this!
          </Text>
          <Button marginRight="1rem" onClick={() => deletePerson()}>
            Yes
          </Button>
          <Button onClick={() => setDeletePersonConfirmationFlag(false)}>
            Cancel
          </Button>
        </Modal>
      )}
      <TagsContainer
        personId={personId}
        tags={tags ? tags : []}
        setFieldToAdd={setFieldToAdd}
        fieldToAdd={fieldToAdd}
      />
      <PersonFieldsInput
        personData={personData.personById}
        fieldToAdd={fieldToAdd}
        onChange={(e) => setFieldToAdd(e.target.value)}
      />
      {fieldToAdd === 'age' && (
        <Modal onClose={() => setFieldToAdd('')}>
          <AgeForm setFieldToAdd={setFieldToAdd} personId={personId} />
        </Modal>
      )}
      {fieldToAdd === 'birthdate' && (
        <Modal onClose={() => setFieldToAdd('')}>
          <BirthdateForm setFieldToAdd={setFieldToAdd} personId={personId} />
        </Modal>
      )}
      {fieldToAdd === 'gender' && (
        <Modal onClose={() => setFieldToAdd('')}>
          <GenderForm setFieldToAdd={setFieldToAdd} personId={personId} />
        </Modal>
      )}
      {fieldToAdd === 'middleName' && (
        <Modal onClose={() => setFieldToAdd('')}>
          <PersonForm
            setFieldToAdd={setFieldToAdd}
            createMiddleName={true}
            personId={personId}
            initialValues={{
              firstName,
              lastName,
            }}
          />
        </Modal>
      )}
      {fieldToAdd === 'note' && (
        <Modal onClose={() => setFieldToAdd('')}>
          <NoteForm setFieldToAdd={setFieldToAdd} personId={personId} />
        </Modal>
      )}
      {fieldToAdd === 'parent' && (
        <Modal onClose={() => setFieldToAdd('')}>
          <ParentForm
            setFieldToAdd={setFieldToAdd}
            childId={personId}
            personFirstName={firstName}
          />
        </Modal>
      )}
      {fieldToAdd === 'child' && (
        <Modal onClose={() => setFieldToAdd('')}>
          <ChildForm
            setFieldToAdd={setFieldToAdd}
            parentId={personId}
            personFirstName={firstName}
          />
        </Modal>
      )}
      {fieldToAdd === 'sibling' && (
        <Modal onClose={() => setFieldToAdd('')}>
          <SiblingForm
            setFieldToAdd={setFieldToAdd}
            siblingOneId={personId}
            personFirstName={firstName}
          />
        </Modal>
      )}
      {fieldToAdd === 'personPlace' && (
        <Modal onClose={() => setFieldToAdd('')}>
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
      {middleName && <MiddleNameContainer middleName={middleName} />}
      {gender && <GenderContainer gender={gender} personId={personId} />}
      {hasAge && (
        <AgeContainer
          age={age}
          monthsOld={monthsOld}
          personId={personId}
          hasBirthYear={!!birthYear}
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
      {siblings && siblings.length > 0 && (
        <SiblingsContainer
          siblings={siblings}
          otherSiblingId={personId}
          otherSiblingLastName={lastName}
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

export const PersonContainer = withRouter(InternalPersonContainer);
