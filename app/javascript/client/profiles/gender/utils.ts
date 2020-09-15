export const GENDER_OPTIONS = [
  { label: '', value: '' },
  { label: 'Man', value: 'male' },
  { label: 'Woman', value: 'female' },
  { label: 'Non-binary', value: 'non_binary' },
  { label: 'Other (please specify)', value: 'custom' },
];

export const GENDER_TEXT_RENDERINGS: Record<string, string> = {
  male: 'male',
  female: 'female',
  non_binary: 'non-binary',
};
