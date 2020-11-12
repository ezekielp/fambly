import React, { ReactNode } from 'react';
import { Option } from 'client/form/SelectInput';
import {
  HomeContainerPersonInfoFragment,
  UserPersonInfoFragment,
  SubContactInfoFragment,
  PersonPlaceInfoFragment,
} from 'client/graphqlTypes';
import { AgeContainer } from 'client/profiles/parent_child/ParentItem';

export const NEW_OR_CURRENT_CONTACT_OPTIONS = [
  { label: 'Create a new person', value: 'new_person' },
  {
    label: 'Select a person already in my contact list',
    value: 'current_person',
  },
];

interface CurrentAndPreviousPlaces {
  currentPlaces: PersonPlaceInfoFragment[];
  previousPlaces: PersonPlaceInfoFragment[];
}

export const getCurrentAndPreviousPlaces = (
  personPlaces: PersonPlaceInfoFragment[],
): CurrentAndPreviousPlaces => {
  return {
    currentPlaces: personPlaces.filter((personPlace) => personPlace.current),
    previousPlaces: personPlaces.filter((personPlace) => !personPlace.current),
  };
};

export const buildPeopleOptions = (
  people: HomeContainerPersonInfoFragment[],
  personIdToExclude: string | undefined,
): Option[] => {
  if (!personIdToExclude) return [];

  const filteredPeople = people.filter(
    (person) => person.id !== personIdToExclude,
  );

  const peopleOptions = filteredPeople.map((person) => {
    const lastName = person.lastName ? ` ${person.lastName}` : '';
    return { label: `${person.firstName}${lastName}`, value: person.id };
  });

  peopleOptions.unshift({ label: '', value: '' });
  return peopleOptions;
};

export const escapeRegexCharacters = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const getAgeContent = (
  age: number | null | undefined,
  monthsOld: number | null | undefined,
): ReactNode | string => {
  if (monthsOld) {
    return <AgeContainer>{`(${monthsOld} months)`}</AgeContainer>;
  } else if (age) {
    return <AgeContainer>{`(${age})`}</AgeContainer>;
  }
  return '';
};

export const filterOutRelationsFromAndSortPeople = (
  people: UserPersonInfoFragment[],
  relationIds: Set<string>,
): UserPersonInfoFragment[] => {
  return people
    .filter((person) => !relationIds.has(person.id))
    .slice()
    .sort((p1, p2) => {
      const personName1 = p1.firstName.toUpperCase();
      const personName2 = p2.firstName.toUpperCase();
      if (personName1 < personName2) {
        return -1;
      } else if (personName2 > personName1) {
        return 1;
      } else {
        return 0;
      }
    });
};

export const getFullNameFromPerson = (person: SubContactInfoFragment): string =>
  person.lastName ? person.firstName + ' ' + person.lastName : person.firstName;

export const getLastNameContent = (
  personOneLastName: string | null | undefined,
  personTwoLastName: string | null | undefined,
): string => {
  if (
    !personOneLastName ||
    (personTwoLastName && personTwoLastName === personOneLastName)
  ) {
    return '';
  } else {
    return ` ${personOneLastName}`;
  }
};

export const MONTH_ABBREVIATIONS: Record<string, string> = {
  1: 'Jan.',
  2: 'Feb.',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'Aug.',
  9: 'Sept.',
  10: 'Oct.',
  11: 'Nov.',
  12: 'Dec.',
};
