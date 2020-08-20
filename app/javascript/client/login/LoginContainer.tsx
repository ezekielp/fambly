import React, { FC, useContext } from "react";
import gql from "graphql-tag";

gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        email
      }
    }
  }
`;

export interface LoginContainerProps {}

export const LoginContainer: FC<LoginContainerProps> = () => {
  return <div>Login Container!</div>;
};
