import React, { FC, useContext, useState } from 'react';
import { AuthContext } from 'client/contexts/AuthContext';
import {
  useLogoutMutation,
  useGetUserForHomeContainerQuery,
} from 'client/graphqlTypes';
import { AddPersonForm } from 'client/profiles/AddPersonForm';
import { gql } from '@apollo/client';
import { withRouter, Link } from 'react-router-dom';
import { Wrapper } from 'client/common/Wrapper';
import { NavBar } from 'client/nav/NavBar';

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
  const [logoutMutation] = useLogoutMutation();
  const {
    data: userData,
    refetch: refetchUserData,
  } = useGetUserForHomeContainerQuery();

  // To do (eventually): Use a loading spinner for loading state
  if (!userData) return null;

  const profileLinks = userData.user?.people?.map((person) => (
    <div key={person.id}>
      <Link to={`/profiles/${person.id}`}>
        {person.firstName}
        {person.lastName && ` ${person.lastName}`}
      </Link>
    </div>
  ));

  const handleLogout = async () => {
    await logoutMutation();
    window.location.href = '/login';
  };

  const navMenuItems = [{ label: 'Log out', onClick: handleLogout }];

  return (
    <Wrapper>
      <NavBar dropdownItems={navMenuItems} />
      <button onClick={() => toggleNewPersonFieldVisible(true)}>
        Add a new person profile
      </button>
      {newPersonFieldVisible && (
        <AddPersonForm refetchUserData={refetchUserData} />
      )}
      {profileLinks}
    </Wrapper>
  );
};

export const HomeContainer = withRouter(InternalHomeContainer);
