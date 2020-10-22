import {
  CreateSiblingRelationshipMutation,
  CreateSiblingRelationshipDocument,
  CreateSiblingRelationshipInput,
} from 'client/graphqlTypes';
import { MockedResponse } from '@apollo/client/testing';

export const createSiblingRelationshipInput: CreateSiblingRelationshipInput = {
  siblingOneId: 'andre-weil-uuid',
  siblingTwoId: null,
  firstName: 'Simone',
  lastName: 'Weil',
  siblingType: 'biological',
  showOnDashboard: true,
  note: null,
};

export const createSiblingRelationshipResult: CreateSiblingRelationshipMutation['createSiblingRelationship'] = {
  errors: null,
  siblingRelationship: {
    id: 'weil-siblings-uuid',
    siblingOne: {
      id: 'andre-weil-uuid',
      firstName: 'Andre',
      lastName: 'Weil',
    },
    siblingTwo: {
      id: 'simone-weil-uuid',
      firstName: 'Simone',
      lastName: 'Weil',
    },
    siblingType: 'biological',
    notes: null,
  },
};

export const createSiblingRelationshipMutation = ({
  input = createSiblingRelationshipInput,
  result = createSiblingRelationshipResult,
} = {}): MockedResponse => ({
  request: {
    query: CreateSiblingRelationshipDocument,
    variables: {
      input,
    },
  },
  result: { data: { createSiblingRelationship: result } },
  newData: jest.fn(() => ({
    data: { createSiblingRelationship: result },
  })),
});
