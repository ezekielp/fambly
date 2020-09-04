import {
  CreateParentChildRelationshipMutation,
  CreateParentChildRelationshipDocument,
  CreateParentChildRelationshipInput,
} from 'client/graphqlTypes';
import { MockedResponse } from '@apollo/client/testing';

export const createParentChildRelationshipInput: CreateParentChildRelationshipInput = {
  parentId: 'some-person-id',
  childId: 'another-person-id',
  parentType: 'biological',
};

export const createParentChildRelationshipResult: CreateParentChildRelationshipMutation['createParentChildRelationship'] = {
  errors: null,
  parentChildRelationship: {
    id: 'some-uuid',
    parent: {
      id: 'some-person-id',
      firstName: 'Lord',
      lastName: 'Byron',
    },
    child: {
      id: 'another-person-id',
      firstName: 'Ada',
      lastName: 'Lovelace',
    },
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
