import React, { ReactNode } from 'react';
import { Option } from 'client/form/SelectInput';
import { HomeContainerPersonInfoFragment } from 'client/graphqlTypes';
import { AgeContainer } from 'client/profiles/parent_child/ParentItem';

export const NEW_OR_CURRENT_CONTACT_OPTIONS = [
  { label: 'Create a new person', value: 'new_person' },
  {
    label: 'Select a person already in my contact list',
    value: 'current_person',
  },
];

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
