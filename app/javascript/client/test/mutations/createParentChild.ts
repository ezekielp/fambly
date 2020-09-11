import {
  CreateParentChildRelationshipMutation,
  CreateParentChildRelationshipDocument,
  CreateParentChildRelationshipInput,
} from 'client/graphqlTypes';
import { MockedResponse } from '@apollo/client/testing';

export const createParentChildRelationshipInput: CreateParentChildRelationshipInput = {
  parentId: 'lord-byron-uuid',
  childId: 'ada-lovelace-uuid',
  parentType: 'biological',
  note: null,
};

export const createParentChildRelationshipResult: CreateParentChildRelationshipMutation['createParentChildRelationship'] = {
  errors: null,
  parentChildRelationship: {
    id: 'byron-lovelace-uuid',
    parent: {
      id: 'lord-byron-uuid',
      firstName: 'Lord',
      lastName: 'Byron',
    },
    child: {
      id: 'ada-lovelace-uuid',
      firstName: 'Ada',
      lastName: 'Lovelace',
    },
    notes: null,
    parentType: 'biological',
  },
};

export const createParentChildRelationshipMutation = ({
  input = createParentChildRelationshipInput,
  result = createParentChildRelationshipResult,
} = {}): MockedResponse => ({
  request: {
    query: CreateParentChildRelationshipDocument,
    variables: {
      input,
    },
  },
  result: { data: { createParentChildRelationship: result } },
  newData: jest.fn(() => ({
    data: { createParentChildRelationship: result },
  })),
});

export const createPersonMock = {
  input: {
    firstName: 'Lord',
    lastName: 'Byron',
  },
  result: {
    errors: null,
    person: {
      id: 'lord-byron-uuid',
      firstName: 'Lord',
      lastName: 'Byron',
    },
  },
};

// export const createParentChildRelationshipMutation = ({
//   input = createParentChildRelationshipInput,
//   result = createParentChildRelationshipResult,
// } = {}): MockedResponse => ({
//   request: {
//     query: CreateParentChildRelationshipDocument,
//     variables: {
//       input,
//     },
//   },
//   result: { data: { createParentChildRelationship: result } },
//   newData: jest.fn(() => ({
//     data: { createParentChildRelationship: result },
//   })),
// });
