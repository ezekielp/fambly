import React, { FC, useContext, useEffect } from 'react';
import { AuthContext } from 'client/contexts/AuthContext';
import { useLoginMutation } from 'client/graphqlTypes';
import { LoginForm, LoginFormData } from './LoginForm';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { gql } from '@apollo/client';

gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        email
      }
      errors {
        path
        message
      }
    }
  }
`;

const InternalLoginContainer: FC<RouteComponentProps> = ({ history }) => {
  // const { userId } = useContext(AuthContext);

  // useEffect(() => {
  //   if (userId) history.push('/home');
  // }, [userId]);

  // if (userId) history.push('/home');

  const [loginMutation] = useLoginMutation();

  const handleSubmit = (data: LoginFormData) =>
    loginMutation({ variables: { input: data } }).then((result) => {
      const userId = result.data?.login.user?.id;
      // if (userId) setUserId(userId);
      if (userId) window.location.href = '/home';
      return result;
    });

  return (
    <>
      <h1>Log In</h1>
      <LoginForm
        initialValues={{ email: '', password: '' }}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export const LoginContainer = withRouter(InternalLoginContainer);
