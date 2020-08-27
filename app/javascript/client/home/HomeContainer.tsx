import React, { FC, useContext, useState } from 'react';
import { AuthContext } from 'client/contexts/AuthContext';
import {
  useLogoutMutation,
  useGetUserForHomeContainerQuery,
} from 'client/graphqlTypes';
import { AddPersonForm } from 'client/form/AddPersonForm';
import { gql } from '@apollo/client';
import { withRouter } from 'react-router-dom';

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

  const [logoutMutation] = useLogoutMutation();
  const { data: userData } = useGetUserForHomeContainerQuery();

  // To do (eventually): Use a loading spinner for loading state
  // if (!userData) return null;

  const [newPersonFieldVisible, toggleNewPersonFieldVisible] = useState(false);

  const handleLogout = async () => {
    await logoutMutation();
    window.location.href = '/login';
  };

  return (
    <>
      <button onClick={handleLogout}>Log Out</button>
      <div>Hello from your Fambly home page!</div>
      <button onClick={() => toggleNewPersonFieldVisible(true)}>
        Add a new person profile
      </button>
      {newPersonFieldVisible && <AddPersonForm />}
    </>
  );
};

export const HomeContainer = withRouter(InternalHomeContainer);
