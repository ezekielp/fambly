import { colors } from 'client/shared/styles';

export const SIBLING_TYPE_OPTIONS = [
  { label: '', value: '' },
  { label: 'Step-sibling', value: 'step_parent' },
  { label: 'In-law', value: 'in_law' },
  { label: 'Biological', value: 'biological' },
];

export const getSiblingTypeText = (
  siblingType: string,
  gender: string | null | undefined,
): string => {
  if (siblingType === 'biological') {
    if (gender === 'male') {
      return 'brother';
    } else if (gender === 'female') {
      return 'sister';
    } else {
      return 'bio';
    }
  } else if (siblingType === 'step_parent') {
    if (gender === 'male') {
      return 'stepbrother';
    } else if (gender === 'female') {
      return 'stepsister';
    } else {
      return 'step-sibling';
    }
  } else if (siblingType === 'in_law') {
    if (gender === 'male') {
      return 'brother-in-law';
    } else if (gender === 'female') {
      return 'sister-in-law';
    } else {
      return 'in-law';
    }
  }
  return '';
};

export const siblingTypeColors: Record<
  string,
  Record<string, keyof typeof colors>
> = {
  biological: {
    backgroundColor: 'darkGreen',
    textColor: 'lightGreen',
  },
  step_sibling: {
    backgroundColor: 'darkBlue',
    textColor: 'lightBlue',
  },
  in_law: {
    backgroundColor: 'darkMagenta',
    textColor: 'lightPink',
  },
};
