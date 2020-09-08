import {
  CreateOrUpdateBirthdateMutation,
  CreateOrUpdateBirthdateDocument,
  CreateOrUpdateBirthdateInput,
} from 'client/graphqlTypes';
import { MockedResponse } from '@apollo/client/testing';

export const createOrUpdateBirthdateInput: CreateOrUpdateBirthdateInput = {
  birthYear: 1919,
  birthMonth: 4,
  birthDay: 24,
  personId: 'david-blackwell-uuid',
};

export const createOrUpdateBirthdateResult: CreateOrUpdateBirthdateMutation['createOrUpdateBirthdate'] = {
  errors: null,
  person: {
    id: 'david-blackwell-uuid',
    birthYear: 1919,
    birthMonth: 4,
    birthDay: 24,
  },
};

export const createOrUpdateBirthdateMutation = ({
  input = createOrUpdateBirthdateInput,
  result = createOrUpdateBirthdateResult,
} = {}): MockedResponse => ({
  request: {
    query: CreateOrUpdateBirthdateDocument,
    variables: {
      input,
    },
  },
  result: { data: { createOrUpdateBirthdate: result } },
  newData: jest.fn(() => ({
    data: { createOrUpdateBirthdate: result },
  })),
});
