import { colors } from 'client/shared/styles';

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

export const getParentTypeText = (
  parentType: string,
  gender: string | null | undefined,
): string => {
  if (parentType === 'biological') {
    if (gender === 'male') {
      return 'father';
    } else if (gender === 'female') {
      return 'mother';
    } else {
      return 'bio';
    }
  } else if (parentType === 'step_parent') {
    if (gender === 'male') {
      return 'stepdad';
    } else if (gender === 'female') {
      return 'stepmom';
    } else {
      return 'step-parent';
    }
  } else if (parentType === 'in_law') {
    if (gender === 'male') {
      return 'father-in-law';
    } else if (gender === 'female') {
      return 'mother-in-law';
    } else {
      return 'in-law';
    }
  }
  return '';
};

export const getChildTypeText = (
  parentType: string,
  gender: string | null | undefined,
): string => {
  if (parentType === 'biological') {
    if (gender === 'male') {
      return 'son';
    } else if (gender === 'female') {
      return 'daughter';
    } else {
      return 'bio';
    }
  } else if (parentType === 'step_parent') {
    if (gender === 'male') {
      return 'stepson';
    } else if (gender === 'female') {
      return 'stepdaughter';
    } else {
      return 'step-child';
    }
  } else if (parentType === 'in_law') {
    if (gender === 'male') {
      return 'son-in-law';
    } else if (gender === 'female') {
      return 'daughter-in-law';
    } else {
      return 'in-law';
    }
  }
  return '';
};

export const parentTypeColors: Record<
  string,
  Record<string, keyof typeof colors>
> = {
  biological: {
    backgroundColor: 'darkGreen',
    textColor: 'lightGreen',
  },
  step_parent: {
    backgroundColor: 'darkBlue',
    textColor: 'lightBlue',
  },
  in_law: {
    backgroundColor: 'darkMagenta',
    textColor: 'lightPink',
  },
};
