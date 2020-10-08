import { Option } from 'client/form/SelectInput';
import { HomeContainerPersonInfoFragment } from 'client/graphqlTypes';

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
