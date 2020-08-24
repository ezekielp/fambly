import {
  CreateUserMutation,
  CreateUserDocument,
  CreateUserInput,
} from 'client/graphqlTypes';
import { MockedResponse } from '@apollo/client/testing';

export const createUserInput: CreateUserInput = {
  email: 'slothrop@gr.com',
  password: 'Schwarzgerat',
};

export const createUserResult: CreateUserMutation['createUser'] = {
  errors: null,
  user: {
    id: 'some-id',
    email: 'slothrop@gr.com',
  },
};

export const createUserMutation = ({
  input = createUserInput,
  result = createUserResult,
} = {}): MockedResponse => ({
  request: {
    query: CreateUserDocument,
    variables: {
      input,
    },
  },
  result: { data: { createUser: result } },
});
