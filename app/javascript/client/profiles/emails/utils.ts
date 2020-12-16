import { colors } from 'client/shared/styles';

export const EMAIL_TYPE_OPTIONS = [
  { label: '', value: '' },
  { label: 'Personal', value: 'personal' },
  { label: 'Work', value: 'work' },
  { label: 'School', value: 'school' },
];

export const emailTypeColors: Record<string, keyof typeof colors> = {
  personal: 'darkBlue',
  work: 'darkMagenta',
  school: 'darkGreen',
};
