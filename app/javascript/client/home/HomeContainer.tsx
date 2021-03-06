import React, { FC, useState, useEffect } from 'react';
import {
  useGetUserForHomeContainerQuery,
  HomeContainerPersonInfoFragmentDoc,
} from 'client/graphqlTypes';
import { PersonForm } from 'client/profiles/PersonForm';
import { TripForm } from 'client/trips/TripForm';
import { Button } from 'client/common/Button';
import { gql } from '@apollo/client';
import { withRouter } from 'react-router-dom';
import { StyledLink } from 'client/common/StyledLink';
import { SectionDivider } from 'client/profiles/PersonContainer';
import { text, spacing, colors } from 'client/shared/styles';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Text } from 'client/common/Text';
import { Swatch } from 'client/profiles/tags/PersonTagForm';
import { Tag } from 'client/profiles/tags/TagsContainer';
import { SearchBox } from 'client/form/search_box/SearchBox';
import { getAgeContent } from 'client/profiles/utils';
import { Modal } from 'client/common/Modal';
import { getInfoForDatesScroller } from './utils';
import { DatesScroller } from 'client/home/dates_scroller/DatesScroller';

gql`
  mutation Logout {
    logout
  }
`;

gql`
  query GetUserForHomeContainer {
    user {
      id
      email
      people {
        ...HomeContainerPersonInfo
      }
      tags {
        id
        name
        color
      }
      dummyEmail {
        id
        email
      }
    }
  }

  ${HomeContainerPersonInfoFragmentDoc}
`;

gql`
  fragment HomeContainerPersonInfo on Person {
    id
    firstName
    lastName
    birthYear
    birthMonth
    birthDay
    anniversary {
      partnerOneName
      partnerOneId
      partnerTwoName
      partnerTwoId
      weddingYear
      weddingMonth
      weddingDay
    }
    showOnDashboard
    age
    monthsOld
    tags {
      id
      name
      color
    }
  }
`;

gql`
  mutation CreatePerson($input: CreatePersonInput!) {
    createPerson(input: $input) {
      person {
        id
        firstName
        lastName
      }
      errors {
        path
        message
      }
    }
  }
`;

const HomeContentContainer = styled.div`
  padding: 2rem;
`;

const SignUpButtonContainer = styled.div`
  display: flex;
  margin-bottom: ${spacing[6]};
  justify-content: center;
`;

const SignUpButton = styled(Button)`
  font-size: ${text[3]};
  font-variation-settings: 'wght' 700;
  border: 3px solid ${colors.black};
  display: block;
`;

const ProfileLinkContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
`;

export const ProfileLink = styled(StyledLink)`
  min-width: fit-content;
  margin-bottom: ${spacing[1]};
`;

const AgeContainer = styled.div`
  margin-bottom: ${spacing[1]};
`;

const StyledSwatch = styled(Swatch)`
  padding: 3px 9px;
  margin-left: 10px;
  margin-right: 0;
  margin-bottom: ${spacing[1]};
`;

const SelectedTagContainer = styled.div`
  margin-bottom: ${spacing[2]};
  width: fit-content;
`;

const StyledButton = styled(Button)`
  margin-bottom: 1.5rem;
`;

interface HomeContainerProps {}

const InternalHomeContainer: FC<HomeContainerProps> = () => {
  const [newPersonFieldVisible, toggleNewPersonFieldVisible] = useState(false);
  const [newTripModalVisible, toggleNewTripModalVisible] = useState(false);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [selectedTagColor, setSelectedTagColor] = useState<string | null>(null);
  const {
    data: userData,
    refetch: refetchUserData,
  } = useGetUserForHomeContainerQuery();

  useEffect(() => {
    refetchUserData();
  }, []);

  // To do (eventually): Use a loading spinner for loading state
  if (!userData) return null;

  const people = userData.user?.people ? userData.user?.people : [];
  const tags = userData.user?.tags ? userData.user?.tags : [];
  const dummyEmail = userData.user?.dummyEmail;

  const infoForDatesScroller = getInfoForDatesScroller(people);

  const profileLinks = people
    .filter((person) => {
      if (person.showOnDashboard) {
        if (tagFilter !== null) {
          if (person?.tags?.map((tag) => tag.name).includes(tagFilter)) {
            return true;
          }
          return false;
        }
        return true;
      }
      return false;
    })
    .sort((p1, p2) => {
      const firstName1 = p1.firstName.toUpperCase();
      const firstName2 = p2.firstName.toUpperCase();
      if (firstName1 < firstName2) {
        return -1;
      } else if (firstName1 > firstName2) {
        return 1;
      } else {
        const lastName1 = p1.lastName ? p1.lastName.toUpperCase() : '';
        const lastName2 = p2.lastName ? p2.lastName.toUpperCase() : '';
        if (lastName1 < lastName2) {
          return -1;
        } else if (lastName1 > lastName2) {
          return 1;
        }
        return 0;
      }
    })
    .map((person) => {
      const tagItems = person?.tags?.map((tag: Tag) => (
        <StyledSwatch
          key={tag.id}
          swatchColor={tag.color}
          cursorPointer={true}
          onClick={() => {
            setTagFilter(tag.name);
            setSelectedTagColor(tag.color ? tag.color : null);
          }}
        >
          {tag.name}
        </StyledSwatch>
      ));
      return (
        <ProfileLinkContainer key={person.id}>
          <ProfileLink to={`/profiles/${person.id}`}>
            {person.firstName}
            {person.lastName && ` ${person.lastName}`}
          </ProfileLink>
          <AgeContainer>
            {getAgeContent(person.age, person.monthsOld)}
          </AgeContainer>
          {tagItems}
        </ProfileLinkContainer>
      );
    });

  const addPersonButton =
    dummyEmail && people.length > 4 ? (
      <Link
        to={{
          pathname: '/signup',
          state: { reachedTrialLimit: true },
        }}
      >
        <StyledButton>Add a new person profile</StyledButton>
      </Link>
    ) : (
      <StyledButton onClick={() => toggleNewPersonFieldVisible(true)}>
        Add a new person profile
      </StyledButton>
    );

  const addTripButton = (
    <StyledButton onClick={() => toggleNewTripModalVisible(true)}>
      Add a new trip
    </StyledButton>
  );

  return (
    <HomeContentContainer>
      {dummyEmail && (
        <SignUpButtonContainer>
          <Link to="/signup">
            <SignUpButton>Sign up</SignUpButton>
          </Link>
        </SignUpButtonContainer>
      )}
      <Text fontSize={4} bold marginBottom={5}>
        Dashboard
      </Text>
      {!newPersonFieldVisible && addPersonButton}
      {/* {addTripButton} */}
      <DatesScroller monthsObject={infoForDatesScroller} />
      {newPersonFieldVisible && (
        <Modal onClose={() => toggleNewPersonFieldVisible(false)}>
          <PersonForm
            refetchUserData={refetchUserData}
            toggleNewPersonFieldVisible={toggleNewPersonFieldVisible}
          />
        </Modal>
      )}
      {newTripModalVisible && (
        <Modal onClose={() => toggleNewTripModalVisible(false)}>
          <TripForm toggleNewTripModalVisible={toggleNewTripModalVisible} />
        </Modal>
      )}
      <SectionDivider />
      <SearchBox
        people={people}
        tags={tags}
        setTagFilter={setTagFilter}
        setSelectedTagColor={setSelectedTagColor}
      />
      <Text fontSize={4} bold marginBottom={2}>
        People
      </Text>
      {tagFilter !== null && (
        <SelectedTagContainer>
          <StyledSwatch
            swatchColor={selectedTagColor}
            cursorPointer={true}
            onClick={() => {
              setTagFilter(null);
              setSelectedTagColor(null);
            }}
          >
            x {tagFilter}
          </StyledSwatch>
        </SelectedTagContainer>
      )}
      {people.length === 0 && <div>No profiles yet!</div>}
      {profileLinks}
    </HomeContentContainer>
  );
};

export const HomeContainer = withRouter(InternalHomeContainer);
