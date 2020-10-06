import {
  GetUserForHomeContainerDocument,
  GetUserForHomeContainerQuery,
} from 'client/graphqlTypes';
import { MockedResponse } from '@apollo/client/testing';

export const getUserForHomeContainerData: GetUserForHomeContainerQuery = {
  user: {
    id: 'ada-lovelace-uuid',
    email: 'ada@lovelace.com',
    people: [
      {
        id: 'lord-byron-uuid',
        firstName: 'Lord',
        lastName: 'Byron',
        showOnDashboard: true,
      },
    ],
    dummyEmail: null,
  },
};

export const getUserForHomeContainerQuery = (
  data = getUserForHomeContainerData,
): MockedResponse => ({
  request: {
    query: GetUserForHomeContainerDocument,
  },
  result: {
    data,
  },
});
