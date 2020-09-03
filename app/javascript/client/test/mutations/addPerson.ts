import {
  CreatePersonMutation,
  CreatePersonDocument,
  CreatePersonInput,
} from 'client/graphqlTypes';
import { MockedResponse } from '@apollo/client/testing';

export const createPersonInput: CreatePersonInput = {
  firstName: 'Roger',
  lastName: 'Mexico',
};

export const createPersonResult: CreatePersonMutation['createPerson'] = {
  errors: null,
  person: {
    id: 'some-uuid',
    ...createPersonInput,
  },
};

export const createPersonMutation = ({
  input = createPersonInput,
  result = createPersonResult,
} = {}): MockedResponse => ({
  request: {
    query: CreatePersonDocument,
    variables: {
      input,
    },
  },
  result: { data: { createPerson: result } },
  newData: jest.fn(() => ({
    data: { createPerson: result },
  })),
});
