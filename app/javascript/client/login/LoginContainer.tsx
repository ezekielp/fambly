import React, { FC, useContext } from 'react';
import { AuthContext } from 'client/contexts/AuthContext';
import { useLoginMutation } from 'client/graphqlTypes';
import { LoginForm, LoginFormData } from './LoginForm';
import { withRouter } from 'react-router-dom';
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

interface LoginContainerProps {}

const InternalLoginContainer: FC<LoginContainerProps> = () => {
  const { userId, dummyEmailFlag } = useContext(AuthContext);
  if (userId && !dummyEmailFlag) window.location.href = '/home';

  const [loginMutation] = useLoginMutation();

  const handleSubmit = (data: LoginFormData) =>
    loginMutation({ variables: { input: data } }).then((result) => {
      const userId = result.data?.login.user?.id;
      if (userId) window.location.href = '/home';
      return result;
    });

  return (
    <>
      <LoginForm
        initialValues={{ email: '', password: '' }}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export const LoginContainer = withRouter(InternalLoginContainer);
