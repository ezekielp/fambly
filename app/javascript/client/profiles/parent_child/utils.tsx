import { Option } from 'client/form/SelectInput';
import { Person } from 'client/graphqlTypes';

export const NEW_OR_CURRENT_CONTACT_OPTIONS = [
  { label: 'Create a new person', value: 'new_person' },
  {
    label: 'Select a person already in my contact list',
    value: 'current_person',
  },
];

export const PARENT_TYPE_OPTIONS = [
  { label: '', value: '' },
  { label: 'Step-parent', value: 'step_parent' },
  { label: 'Parent in-law', value: 'in_law' },
  { label: 'Biological', value: 'biological' },
];

export const CHILD_TYPE_OPTIONS = [
  { label: '', value: '' },
  { label: 'Step-child', value: 'step_parent' },
  { label: 'In-law', value: 'in_law' },
  { label: 'Biological', value: 'biological' },
];

export const buildParentOrChildOptions = (
  people: Person[],
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

interface PotentialParentAndChildIds {
  newPersonId: string | null | undefined;
  propParentId: string | null | undefined;
  propChildId: string | null | undefined;
  formParentId: string | null | undefined;
  formChildId: string | null | undefined;
}

interface ParentAndChildIds {
  parentId: string;
  childId: string;
}

export const getParentAndChildIds = (
  potentialParentAndChildIds: PotentialParentAndChildIds,
): ParentAndChildIds => {
  const {
    newPersonId,
    propParentId,
    propChildId,
    formParentId,
    formChildId,
  } = potentialParentAndChildIds;
  let parentId, childId;

  if (propParentId) {
    parentId = propParentId;
    if (newPersonId) {
      childId = newPersonId;
    } else {
      childId = formChildId;
    }
  } else {
    childId = propChildId;
    if (newPersonId) {
      parentId = newPersonId;
    } else {
      parentId = formParentId;
    }
  }

  parentId = parentId ? parentId : '';
  childId = childId ? childId : '';
  return { parentId, childId };
};
