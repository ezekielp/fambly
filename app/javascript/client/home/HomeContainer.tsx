import React, { FC, useContext, useState } from 'react';
import { AuthContext } from 'client/contexts/AuthContext';
import { useGetUserForHomeContainerQuery } from 'client/graphqlTypes';
import { AddPersonForm } from 'client/profiles/AddPersonForm';
import { Button } from 'client/common/Button';
import { gql } from '@apollo/client';
import { withRouter } from 'react-router-dom';
import { StyledLink } from 'client/common/StyledLink';
import { SectionDivider } from 'client/profiles/PersonContainer';
import { text, spacing } from 'client/shared/styles';
import styled from 'styled-components';

gql`
  mutation Logout {
    logout
  }
`;

gql`
  query GetUserForHomeContainer {
    user {
      id
      people {
        id
        firstName
        lastName
        showOnDashboard
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

const PeopleHeader = styled.h1`
  font-size: ${text[4]};
  font-weight: 700;
  margin-bottom: ${spacing[2]};
`;

const ProfileLinkContainer = styled.div`
  margin-bottom: ${spacing[1]};
`;

interface HomeContainerProps {}

const InternalHomeContainer: FC<HomeContainerProps> = () => {
  const { userId } = useContext(AuthContext);
  if (!userId) window.location.href = '/login';

  const [newPersonFieldVisible, toggleNewPersonFieldVisible] = useState(false);
  const {
    data: userData,
    refetch: refetchUserData,
  } = useGetUserForHomeContainerQuery();

  // To do (eventually): Use a loading spinner for loading state
  if (!userData) return null;

  const profileLinks = userData.user?.people?.map((person) => (
    <ProfileLinkContainer key={person.id}>
      <StyledLink to={`/profiles/${person.id}`}>
        {person.firstName}
        {person.lastName && ` ${person.lastName}`}
      </StyledLink>
    </ProfileLinkContainer>
  ));

  return (
    <HomeContentContainer>
      {!newPersonFieldVisible && (
        <Button onClick={() => toggleNewPersonFieldVisible(true)}>
          Add a new person profile
        </Button>
      )}
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
