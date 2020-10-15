import { GetUserPeopleDocument, GetUserPeopleQuery } from 'client/graphqlTypes';
import { MockedResponse } from '@apollo/client/testing';

export const getUserPeopleData: GetUserPeopleQuery = {
  people: [
    {
      id: 'lord-byron-uuid',
      firstName: 'Lord',
      lastName: 'Byron',
    },
  ],
};

export const getUserPeopleQuery = (
  data = getUserPeopleData,
): MockedResponse => ({
  request: {
    query: GetUserPeopleDocument,
  },
  result: {
    data,
  },
});
