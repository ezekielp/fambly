import {
  CreateAgeMutation,
  CreateAgeDocument,
  CreateAgeInput,
} from 'client/graphqlTypes';
import { MockedResponse } from '@apollo/client/testing';

export const createAgeInput: CreateAgeInput = {
  personId: 'lord-byron-uuid',
  age: 28,
};

export const createAgeResult: CreateAgeMutation['createAge'] = {
  errors: null,
  person: {
    id: 'lord-byron-uuid',
    age: 28,
  },
};

export const createAgeMutation = ({
  input = createAgeInput,
  result = createAgeResult,
} = {}): MockedResponse => ({
  request: {
    query: CreateAgeDocument,
    variables: {
      input,
    },
  },
  result: { data: { createAge: result } },
  newData: jest.fn(() => ({
    data: { createAge: result },
  })),
});
