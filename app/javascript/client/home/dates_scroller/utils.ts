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
