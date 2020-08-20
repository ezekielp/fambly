import { LoginMutation, LoginDocument, LoginInput } from "client/graphqlTypes";
import { MockedResponse } from "@apollo/react-testing";

export const loginInput: LoginInput = {
  email: "slothrop@gr.com",
  password: "Schwarzgerat",
};

export const loginResult: LoginMutation["login"] = {
  user: {
    id: "some-id",
    email: "slothrop@gr.com",
  },
};

export const loginMutation = ({
  input = loginInput,
  result = loginResult,
} = {}): MockedResponse => ({
  request: {
    query: LoginDocument,
    variables: {
      input,
    },
  },
  result: { data: { login: result } },
});
