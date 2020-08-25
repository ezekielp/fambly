import React, { FC, useContext } from 'react';
import { AuthContext } from 'client/contexts/AuthContext';
import { useCreateUserMutation } from '../graphqlTypes';
import { SignupForm, CreateUserData } from './SignupForm';
import { gql } from '@apollo/client';

gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
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

export interface SignupContainerProps {}

export const SignupContainer: FC<SignupContainerProps> = () => {
  const { userId } = useContext(AuthContext);
  if (userId) window.location.href = '/home';

  const [createUserMutation] = useCreateUserMutation();

  const handleSubmit = (data: CreateUserData) =>
    createUserMutation({ variables: { input: data } }).then((result) => {
      const userId = result.data?.createUser.user?.id;
      if (userId) window.location.href = '/home';
      return result;
    });

  return (
    <>
      <h1>Sign Up</h1>
      <SignupForm
        initialValues={{ email: '', password: '', confirmedPassword: '' }}
        onSubmit={handleSubmit}
      />
    </>
  );
};
