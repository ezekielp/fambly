import { HomeContainerPersonInfoFragment } from 'client/graphqlTypes';

export const SEARCH_TYPE_OPTIONS = [
  { label: 'Search by', value: 'search' },
  { label: 'Filter by', value: 'filter' },
];

export const SEARCH_VARIABLE_OPTIONS = [
  { label: 'First name', value: 'firstName' },
  { label: 'Last name', value: 'lastName' },
];

export const SEARCH_FILTER_OPTIONS = [{ label: 'Group name', value: 'group' }];

export const getFullNamesFromPeople = (
  people: HomeContainerPersonInfoFragment[],
): string[] =>
  people.map((person) =>
    person.lastName ? person.firstName + person.lastName : person.firstName,
  );
