import { colors } from 'client/shared/styles';

export const MONTHS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export const getRotatedMonths = (months: number[]): number[] => {
  const today = new Date();
  const currentMonth = today.getMonth();
  return months.slice(currentMonth).concat(months.slice(0, currentMonth));
};

export const addSuffixToNumber = (age: number): string => {
  const ageString = age.toString();
  if (age > 3 && age < 19) return ageString + 'th';

  const lastDigit = ageString[ageString.length - 1];
  switch (lastDigit) {
    case '1':
      return ageString + 'st';
    case '2':
      return ageString + 'nd';
    case '3':
      return ageString + 'rd';
    default:
      return ageString + 'th';
  }
};

export const MONTH_COLORS: Record<string, keyof typeof colors> = {
  1: 'lightBlue',
  2: 'lightPink',
  3: 'mediumGreen',
  4: 'yellow',
  5: 'lightGreen',
  6: 'red',
  7: 'darkBlue',
  8: 'darkYellow',
  9: 'mediumBlue',
  10: 'orange',
  11: 'purple',
  12: 'darkGreen',
};

export const MONTH_TEXT_COLORS: Record<string, keyof typeof colors> = {
  1: 'white',
  2: 'white',
  3: 'white',
  4: 'black',
  5: 'white',
  6: 'white',
  7: 'white',
  8: 'black',
  9: 'white',
  10: 'white',
  11: 'white',
  12: 'white',
};
