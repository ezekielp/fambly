import React, { FC, useContext } from "react";
import { useLoginMutation } from "../graphqlTypes";
import gql from "graphql-tag";

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

  const handleSubmit = (data: LoginFormData) => {};

  return (
    <>
      <h1>Login</h1>
      <LoginForm initialValues={{}} onSubmit={handleSubmit} />
    </>
  );
};
