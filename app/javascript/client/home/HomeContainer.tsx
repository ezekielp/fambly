import React, { FC, useContext } from 'react';
import { AuthContext } from 'client/contexts/AuthContext';
import { useLogoutMutation } from 'client/graphqlTypes';
import { gql } from '@apollo/client';
import { withRouter } from 'react-router-dom';

gql`
  mutation Logout {
    logout
  }
`;

interface HomeContainerProps {}

const InternalHomeContainer: FC<HomeContainerProps> = () => {
  const { userId } = useContext(AuthContext);
  if (!userId) window.location.href = '/login';

  const [logoutMutation] = useLogoutMutation();

  const handleLogout = async () => {
    await logoutMutation();
    window.location.href = '/login';
  };

  return (
    <>
      <button onClick={handleLogout}>Log Out</button>
      <div>Hello from the HomeContainer!</div>;
    </>
  );
};

export const HomeContainer = withRouter(InternalHomeContainer);
