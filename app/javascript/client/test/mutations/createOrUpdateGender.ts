import {
  CreateOrUpdateGenderMutation,
  CreateOrUpdateGenderDocument,
  CreateOrUpdateGenderInput,
} from 'client/graphqlTypes';
import { MockedResponse } from '@apollo/client/testing';

export const createOrUpdateGenderInput: CreateOrUpdateGenderInput = {
  gender: 'female',
  personId: 'katherine-johnson-uuid',
};

export const createOrUpdateGenderResult: CreateOrUpdateGenderMutation['createOrUpdateGender'] = {
  errors: null,
  person: {
    id: 'katherine-johnson-uuid',
    gender: 'female',
  },
};

export const createOrUpdateGenderMutation = ({
  input = createOrUpdateGenderInput,
  result = createOrUpdateGenderResult,
} = {}): MockedResponse => ({
  request: {
    query: CreateOrUpdateGenderDocument,
    variables: {
      input,
    },
  },
  result: { data: { createOrUpdateGender: result } },
  newData: jest.fn(() => ({
    data: { createOrUpdateGender: result },
  })),
});
