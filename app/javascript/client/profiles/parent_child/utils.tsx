import { Option } from 'client/form/SelectInput';
import { Person } from 'client/graphqlTypes';

export const PARENT_TYPE_OPTIONS = [
  { label: '', value: '' },
  { label: 'Step parent', value: 'step_parent' },
  { label: 'Parent in-law', value: 'in_law' },
  { label: 'Biological', value: 'biological' },
];

export const buildParentOrChildOptions = (
  people: Person[],
  personIdToExclude: string,
): Option[] => {
  const filteredPeople = people.filter(
    (person) => person.id !== personIdToExclude,
  );

  return filteredPeople.map((person) => {
    const lastName = person.lastName ? ` ${person.lastName}` : '';
    return { label: `${person.firstName}${lastName}`, value: person.id };
  });
};
