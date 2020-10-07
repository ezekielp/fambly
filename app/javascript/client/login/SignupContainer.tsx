import React, { FC, useContext } from 'react';
import { AuthContext } from 'client/contexts/AuthContext';
import { useCreateUserMutation } from '../graphqlTypes';
import { SignupForm, CreateUserData } from './SignupForm';
import { withRouter, RouteComponentProps } from 'react-router-dom';
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

export interface SignupContainerProps {
  reachedTrialLimit?: boolean;
}

const InternalSignupContainer: FC<RouteComponentProps<
  {},
  any,
  SignupContainerProps
>> = ({ location }) => {
  const { userId, dummyEmailFlag } = useContext(AuthContext);
  if (userId && !dummyEmailFlag) window.location.href = '/home';

  const [createUserMutation] = useCreateUserMutation();

  const handleSubmit = (data: CreateUserData) =>
    createUserMutation({ variables: { input: data } });

  const reachedTrialLimit =
    location.state && location.state.reachedTrialLimit ? true : false;

  return (
    <>
      <SignupForm
        initialValues={{ email: '', password: '', confirmedPassword: '' }}
        onSubmit={handleSubmit}
        reachedTrialLimit={reachedTrialLimit}
      />
    </>
  );
};

export const SignupContainer = withRouter(InternalSignupContainer);
