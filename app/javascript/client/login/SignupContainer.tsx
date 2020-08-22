import React, { FC, useContext } from 'react';
// import {  } from '../graphqlTypes';
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
  return <></>;
};
