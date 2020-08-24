import React, { FC, useContext, useEffect } from 'react';
import { AuthContext } from 'client/contexts/AuthContext';
import { useLogoutMutation } from 'client/graphqlTypes';
import { gql } from '@apollo/client';
import { withRouter, RouteComponentProps } from 'react-router-dom';

gql`
  mutation Logout {
    logout
  }
`;

interface HomeContainerProps {}

const InternalHomeContainer: FC<HomeContainerProps & RouteComponentProps> = ({
  history,
}) => {
  // const { userId } = useContext(AuthContext);

  // useEffect(() => {
  //   if (!userId) history.push('/login');
  // }, [userId]);

  // if (!userId) history.push('/login');

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
