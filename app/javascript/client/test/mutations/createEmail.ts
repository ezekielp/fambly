import {
  CreateEmailMutation,
  CreateEmailDocument,
  CreateEmailInput,
} from 'client/graphqlTypes';
import { MockedResponse } from '@apollo/client/testing';

export const createEmailInput: CreateEmailInput = {
  personId: 'richard-feynman-uuid',
  email: 'dick.feynman@mit.edu',
  emailType: 'school',
};

export const createEmailResult: CreateEmailMutation['createEmail'] = {
  errors: null,
  email: {
    id: 'feynman-email-id',
    email: 'dick.feynman@mit.edu',
    emailType: 'school',
  },
};

export const createEmailMutation = ({
  input = createEmailInput,
  result = createEmailResult,
} = {}): MockedResponse => ({
  request: {
    query: CreateEmailDocument,
    variables: {
      input,
    },
  },
  result: { data: { createEmail: result } },
  newData: jest.fn(() => ({
    data: { createEmail: result },
  })),
});
