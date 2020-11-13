export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const getRotatedMonths = (months: string[]): string[] => {
  const today = new Date();
  const currentMonth = today.getMonth();
  return months.slice(currentMonth).concat(months.slice(0, currentMonth));
};

export const addSuffixToNumber = (age: number): string => {
  const ageString = age.toString();
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
