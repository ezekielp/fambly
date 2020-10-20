import { colors } from 'client/shared/styles';

export const PARTNER_TYPE_OPTIONS = [
  { label: '', value: '' },
  { label: 'Marriage', value: 'marriage' },
  { label: 'Dating / partners', value: 'dating' },
];

export const getPartnerTypeText = (
  relationshipType: string,
  gender: string | null | undefined,
  current: boolean,
): string => {
  let typeText = '';
  if (relationshipType === 'marriage') {
    if (gender === 'male') {
      typeText = 'husband';
    } else if (gender === 'female') {
      typeText = 'wife';
    } else {
      typeText = 'spouse';
    }
  } else if (relationshipType === 'dating') {
    if (gender === 'male') {
      typeText = 'boyfriend';
    } else if (gender === 'female') {
      typeText = 'girlfriend';
    } else {
      typeText = 'partner';
    }
  }

  if (current) {
    return typeText;
  } else {
    return 'ex-' + typeText;
  }
};

export const partnerTypeColors: Record<
  string,
  Record<string, keyof typeof colors>
> = {
  marriage: {
    backgroundColor: 'purple',
    textColor: 'lightPurple',
  },
  dating: {
    backgroundColor: 'red',
    textColor: 'lightPink',
  },
};

export const relationshipDatesColors: Record<
  string,
  Record<string, keyof typeof colors>
> = {
  anniversary: {
    backgroundColor: 'mediumBlue',
    textColor: 'veryLightBlue',
  },
  startAndEndDates: {
    backgroundColor: 'white',
    textColor: 'black',
  },
};
