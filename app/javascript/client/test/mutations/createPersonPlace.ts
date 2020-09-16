import {
  CreatePersonPlaceMutation,
  CreatePersonPlaceDocument,
  CreatePersonPlaceInput,
} from 'client/graphqlTypes';
import { MockedResponse } from '@apollo/client/testing';

export const createPersonPlaceInput: CreatePersonPlaceInput = {
  personId: 'evelyn-boyd-granville-uuid',
  country: 'USA',
  stateOrRegion: 'DC',
  town: 'Washington',
  street: null,
  zipCode: null,
  birthPlace: true,
  startMonth: 5,
  startYear: 1924,
  endMonth: null,
  endYear: null,
  note: null,
};

export const createPersonPlaceResult: CreatePersonPlaceMutation['createPersonPlace'] = {
  errors: null,
  personPlace: {
    id: 'evelyn-boyd-granville-birthplace-uuid',
    place: {
      id: 'washington-dc-uuid',
      country: 'USA',
      stateOrRegion: 'DC',
      town: 'Washington',
      street: null,
      zipCode: null,
    },
    person: {
      id: 'evelyn-boyd-granville-uuid',
      firstName: 'Evelyn',
    },
    birthPlace: true,
    current: false,
    startMonth: 5,
    startYear: 1924,
    endMonth: null,
    endYear: null,
    notes: null,
  },
};

export const createPersonPlaceMutation = ({
  input = createPersonPlaceInput,
  result = createPersonPlaceResult,
} = {}): MockedResponse => ({
  request: {
    query: CreatePersonPlaceDocument,
    variables: {
      input,
    },
  },
  result: { data: { createPersonPlace: result } },
  newData: jest.fn(() => ({
    data: { createPersonPlace: result },
  })),
});
