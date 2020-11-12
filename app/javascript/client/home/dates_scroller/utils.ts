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
