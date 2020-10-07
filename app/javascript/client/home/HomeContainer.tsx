import React, { FC, useState, useEffect } from 'react';
import {
  useGetUserForHomeContainerQuery,
  HomeContainerPersonInfoFragmentDoc,
} from 'client/graphqlTypes';
import { AddPersonForm } from 'client/profiles/AddPersonForm';
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
    showOnDashboard
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
  margin-bottom: ${spacing[1]};
`;

const ProfileLink = styled(StyledLink)`
  margin-right: 1rem;
  min-width: fit-content;
`;

const StyledSwatch = styled(Swatch)`
  padding: 3px 9px;
`;

interface HomeContainerProps {}

const InternalHomeContainer: FC<HomeContainerProps> = () => {
  const [newPersonFieldVisible, toggleNewPersonFieldVisible] = useState(false);
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
  const dummyEmail = userData.user?.dummyEmail;

  const profileLinks = people
    .filter((person) => person.showOnDashboard)
    .map((person) => {
      const tagItems = person?.tags?.map((tag: Tag) => (
        <StyledSwatch key={tag.id} swatchColor={tag.color} cursorPointer={true}>
          {tag.name}
        </StyledSwatch>
      ));
      return (
        <ProfileLinkContainer key={person.id}>
          <ProfileLink to={`/profiles/${person.id}`}>
            {person.firstName}
            {person.lastName && ` ${person.lastName}`}
          </ProfileLink>
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
        <Button>Add a new person profile</Button>
      </Link>
    ) : (
      <Button onClick={() => toggleNewPersonFieldVisible(true)}>
        Add a new person profile
      </Button>
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
      {newPersonFieldVisible && (
        <AddPersonForm
          refetchUserData={refetchUserData}
          toggleNewPersonFieldVisible={toggleNewPersonFieldVisible}
        />
      )}
      <SectionDivider />
      <Text fontSize={4} bold marginBottom={2}>
        People
      </Text>
      {people.length === 0 && <div>No profiles yet!</div>}
      {profileLinks}
    </HomeContentContainer>
  );
};

export const HomeContainer = withRouter(InternalHomeContainer);
