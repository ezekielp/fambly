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
import { EmailForm } from './emails/EmailForm';
import { EmailsContainer } from './emails/EmailsContainer';
import { ParentForm } from './parent_child/ParentForm';
import { ChildForm } from './parent_child/ChildForm';
import { SiblingForm } from './sibling/SiblingForm';
import { ParentsContainer } from './parent_child/ParentsContainer';
import { ChildrenContainer } from './parent_child/ChildrenContainer';
import { SiblingsContainer } from './sibling/SiblingsContainer';
import { AmorousPartnerForm } from './amorous_relationship/AmorousPartnerForm';
import { AmorousPartnersContainer } from './amorous_relationship/AmorousPartnersContainer';
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
import { getCurrentAndPreviousPlaces } from './utils';

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
    emails {
      id
      emailAddress
      emailType
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
    partners {
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
    placeType
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
    {
      label: 'Edit name',
      onClick: () => setEditNameFlag(true),
    },
  ];

  const {
    data: personData,
    refetch: refetchPersonData,
  } = useGetPersonForPersonContainerQuery({
    variables: { personId },
  });

  if (!personData) return null;
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
    emails,
    parents,
    children,
    siblings,
    partners,
    personPlaces,
  } = personData.personById;

  const relations = (parents ? parents : [])
    .concat(children ? children : [])
    .concat(siblings ? siblings : [])
    .concat(partners ? partners : []);

  const { currentPlaces, previousPlaces } = getCurrentAndPreviousPlaces(
    personPlaces ? personPlaces : [],
  );

  const hasAge = age || monthsOld;
  const hasBirthdate = birthYear || birthMonth;
  const hasEmails = !!(emails && emails.length > 0);
  const hasCurrentPlaces = currentPlaces.length > 0;
  const hasVitals =
    gender || hasAge || hasBirthdate || hasEmails || hasCurrentPlaces;
  const hasFamily =
    (parents && parents.length > 0) ||
    (children && children.length > 0) ||
    (siblings && siblings.length > 0);
  const hasPersonalHistory = previousPlaces.length > 0;

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
      {editNameFlag && (
        <Modal onClose={() => setEditNameFlag(false)}>
          <PersonForm
            setEditFlag={setEditNameFlag}
            initialValues={{
              firstName,
              middleName: middleName ? middleName : '',
              lastName: lastName ? lastName : '',
            }}
            personId={personId}
          />
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
            updateMiddleName={true}
            personId={personId}
            initialValues={{
              firstName,
              lastName,
            }}
          />
        </Modal>
      )}
      {fieldToAdd === 'lastName' && (
        <Modal onClose={() => setFieldToAdd('')}>
          <PersonForm
            setFieldToAdd={setFieldToAdd}
            personId={personId}
            addLastName={true}
            initialValues={{
              firstName,
              lastName: '',
            }}
          />
        </Modal>
      )}
      {fieldToAdd === 'email' && (
        <Modal onClose={() => setFieldToAdd('')}>
          <EmailForm setFieldToAdd={setFieldToAdd} personId={personId} />
        </Modal>
      )}
      {fieldToAdd === 'note' && (
        <Modal onClose={() => setFieldToAdd('')}>
          <NoteForm setFieldToAdd={setFieldToAdd} personId={personId} />
        </Modal>
      )}
      {fieldToAdd === 'spouse' && (
        <Modal onClose={() => setFieldToAdd('')}>
          <AmorousPartnerForm
            setFieldToAdd={setFieldToAdd}
            partnerOneId={personId}
            personFirstName={firstName}
            relations={relations}
            propRelationshipType="marriage"
            propCurrent={true}
          />
        </Modal>
      )}
      {fieldToAdd === 'exSpouse' && (
        <Modal onClose={() => setFieldToAdd('')}>
          <AmorousPartnerForm
            setFieldToAdd={setFieldToAdd}
            partnerOneId={personId}
            personFirstName={firstName}
            relations={relations}
            propRelationshipType="marriage"
            propCurrent={false}
          />
        </Modal>
      )}
      {fieldToAdd === 'partner' && (
        <Modal onClose={() => setFieldToAdd('')}>
          <AmorousPartnerForm
            setFieldToAdd={setFieldToAdd}
            partnerOneId={personId}
            personFirstName={firstName}
            relations={relations}
            propRelationshipType="dating"
            propCurrent={true}
          />
        </Modal>
      )}
      {fieldToAdd === 'exPartner' && (
        <Modal onClose={() => setFieldToAdd('')}>
          <AmorousPartnerForm
            setFieldToAdd={setFieldToAdd}
            partnerOneId={personId}
            personFirstName={firstName}
            relations={relations}
            propRelationshipType="dating"
            propCurrent={false}
          />
        </Modal>
      )}
      {fieldToAdd === 'parent' && (
        <Modal onClose={() => setFieldToAdd('')}>
          <ParentForm
            setFieldToAdd={setFieldToAdd}
            childId={personId}
            personFirstName={firstName}
            relations={relations}
          />
        </Modal>
      )}
      {fieldToAdd === 'child' && (
        <Modal onClose={() => setFieldToAdd('')}>
          <ChildForm
            setFieldToAdd={setFieldToAdd}
            parentId={personId}
            personFirstName={firstName}
            relations={relations}
          />
        </Modal>
      )}
      {fieldToAdd === 'sibling' && (
        <Modal onClose={() => setFieldToAdd('')}>
          <SiblingForm
            setFieldToAdd={setFieldToAdd}
            siblingOneId={personId}
            personFirstName={firstName}
            relations={relations}
          />
        </Modal>
      )}
      {fieldToAdd === 'personPlace' && (
        <Modal onClose={() => setFieldToAdd('')}>
          <PersonPlaceForm setFieldToAdd={setFieldToAdd} personId={personId} />
        </Modal>
      )}
      {fieldToAdd === 'address' && (
        <Modal onClose={() => setFieldToAdd('')}>
          <PersonPlaceForm
            setFieldToAdd={setFieldToAdd}
            personId={personId}
            propCurrent={true}
          />
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
      {middleName && (
        <MiddleNameContainer
          personId={personId}
          firstName={firstName}
          middleName={middleName}
          lastName={lastName ? lastName : ''}
        />
      )}
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
      {hasEmails && <EmailsContainer emails={emails ? emails : []} />}
      {hasCurrentPlaces && (
        <PersonPlacesContainer
          personPlaces={currentPlaces}
          firstName={firstName}
          current={true}
        />
      )}
      {partners && partners.length > 0 && (
        <>
          <SectionDivider />
          <Subheading>Relationships</Subheading>
          <AmorousPartnersContainer
            amorousPartners={partners}
            otherPartnerFirstName={firstName}
            otherPartnerLastName={lastName}
            otherPartnerId={personId}
            relations={relations}
          />
        </>
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
          relations={relations}
        />
      )}
      {children && children.length > 0 && (
        <ChildrenContainer
          actualChildren={children}
          parentId={personId}
          parentLastName={lastName}
          relations={relations}
        />
      )}
      {siblings && siblings.length > 0 && (
        <SiblingsContainer
          siblings={siblings}
          otherSiblingId={personId}
          otherSiblingLastName={lastName}
          relations={relations}
        />
      )}
      {hasPersonalHistory && (
        <>
          <SectionDivider />
          <Subheading>Personal history</Subheading>
        </>
      )}
      {previousPlaces.length > 0 && (
        <PersonPlacesContainer
          personPlaces={previousPlaces}
          firstName={firstName}
          current={false}
        />
      )}
    </BelowNavContainer>
  );
};

export const PersonContainer = withRouter(InternalPersonContainer);
