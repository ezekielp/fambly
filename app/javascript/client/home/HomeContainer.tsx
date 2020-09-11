import React, { FC, useContext, useState } from 'react';
import { AuthContext } from 'client/contexts/AuthContext';
import { useGetUserForHomeContainerQuery } from 'client/graphqlTypes';
import { AddPersonForm } from 'client/profiles/AddPersonForm';
import { gql } from '@apollo/client';
import { withRouter } from 'react-router-dom';
import { StyledLink } from 'client/common/StyledLink';

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
    <div key={person.id}>
      <StyledLink to={`/profiles/${person.id}`}>
        {person.firstName}
        {person.lastName && ` ${person.lastName}`}
      </StyledLink>
    </div>
  ));

  return (
    <>
      <button onClick={() => toggleNewPersonFieldVisible(true)}>
        Add a new person profile
      </button>
      {newPersonFieldVisible && (
        <AddPersonForm refetchUserData={refetchUserData} />
      )}
      {profileLinks}
    </>
  );
};

export const HomeContainer = withRouter(InternalHomeContainer);
