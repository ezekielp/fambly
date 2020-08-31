export const FEBRUARY_DAYS_OPTIONS = {
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  11: 11,
  12: 12,
  13: 13,
  14: 14,
  15: 15,
  16: 16,
  17: 17,
  18: 18,
  19: 19,
  20: 20,
  21: 21,
  22: 22,
  23: 23,
  24: 24,
  25: 25,
  26: 26,
  27: 27,
  28: 28,
  29: 29,
};

export const THIRTY_DAYS_OPTIONS = {
  ...FEBRUARY_DAYS_OPTIONS,
  30: 30,
};

export const THIRTY_ONE_DAYS_OPTIONS = {
  ...THIRTY_DAYS_OPTIONS,
  31: 31,
};

export const MONTH_OPTIONS = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
};

export const determineDaysOptions = (
  month: number | null | undefined,
  februaryDaysOptions: Record<string, unknown>,
  thirtyDaysOptions: Record<string, unknown>,
  thirtyOneDaysOptions: Record<string, unknown>,
): Record<string, unknown> => {
  if (month === 2) {
    return februaryDaysOptions;
  } else if (month === 4 || month === 6 || month === 9 || month === 11) {
    return thirtyDaysOptions;
  }

  return thirtyOneDaysOptions;
};
