import React, { FC, useContext } from 'react';
import { useLoginMutation } from '../graphqlTypes';
import { LoginForm, LoginFormData } from './LoginForm';
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

export interface LoginContainerProps {}

export const LoginContainer: FC<LoginContainerProps> = () => {
  const [loginMutation] = useLoginMutation();

  const handleSubmit = (data: LoginFormData) =>
    loginMutation({ variables: { input: data } });

  return (
    <>
      <h1>Login</h1>
      <LoginForm
        initialValues={{ email: '', password: '' }}
        onSubmit={handleSubmit}
      />
    </>
  );
};
