import React, { FC, useState } from 'react';
import { useGetUserForHomeContainerQuery } from 'client/graphqlTypes';
import { AddPersonForm } from 'client/profiles/AddPersonForm';
import { Button } from 'client/common/Button';
import { gql } from '@apollo/client';
import { withRouter } from 'react-router-dom';
import { StyledLink } from 'client/common/StyledLink';
import { SectionDivider } from 'client/profiles/PersonContainer';
import { text, spacing } from 'client/shared/styles';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

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
        id
        firstName
        lastName
        showOnDashboard
      }
      dummyEmail {
        id
        email
      }
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

const SignUpButton = styled(Button)`
  font-size: ${text[3]};
`;

const PeopleHeader = styled.h1`
  font-size: ${text[4]};
  font-variation-settings: 'wght' 700;
  margin-bottom: ${spacing[2]};
`;

const ProfileLinkContainer = styled.div`
  margin-bottom: ${spacing[1]};
`;

interface HomeContainerProps {}

const InternalHomeContainer: FC<HomeContainerProps> = () => {
  const [newPersonFieldVisible, toggleNewPersonFieldVisible] = useState(false);
  const {
    data: userData,
    refetch: refetchUserData,
  } = useGetUserForHomeContainerQuery();

  // To do (eventually): Use a loading spinner for loading state
  if (!userData) return null;

  const people = userData.user?.people ? userData.user?.people : [];
  const dummyEmail = userData.user?.dummyEmail;

  const profileLinks = people.map((person) => (
    <ProfileLinkContainer key={person.id}>
      <StyledLink to={`/profiles/${person.id}`}>
        {person.firstName}
        {person.lastName && ` ${person.lastName}`}
      </StyledLink>
    </ProfileLinkContainer>
  ));

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
      {dummyEmail && <SignUpButton>Sign up</SignUpButton>}
      {!newPersonFieldVisible && addPersonButton}
      {newPersonFieldVisible && (
        <AddPersonForm
          refetchUserData={refetchUserData}
          toggleNewPersonFieldVisible={toggleNewPersonFieldVisible}
        />
      )}
      <SectionDivider />
      <PeopleHeader>People</PeopleHeader>
      {profileLinks}
    </HomeContentContainer>
  );
};

export const HomeContainer = withRouter(InternalHomeContainer);
