import { Option } from 'client/form/SelectInput';

export const generateDayOptions = (upperLimit: number) => {
  const result = Array(upperLimit)
    .fill({ label: '', value: null })
    .map((option, idx) => {
      option['label'] = idx + 1;
      option['value'] = idx + 1;
      return option;
    });

  result.unshift({ label: '', value: null });
  return result;
};

export const MONTH_OPTIONS = [
  { label: '', value: '' },
  { label: 'January', value: '1' },
  { label: 'February', value: '2' },
  { label: 'March', value: '3' },
  { label: 'April', value: '4' },
  { label: 'May', value: '5' },
  { label: 'June', value: '6' },
  { label: 'July', value: '7' },
  { label: 'August', value: '8' },
  { label: 'September', value: '9' },
  { label: 'October', value: '10' },
  { label: 'November', value: '11' },
  { label: 'December', value: '12' },
];

export const FEBRUARY_DAYS_OPTIONS = [
  { label: '', value: '' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '10', value: '10' },
  { label: '11', value: '11' },
  { label: '12', value: '12' },
  { label: '13', value: '13' },
  { label: '14', value: '14' },
  { label: '15', value: '15' },
  { label: '16', value: '16' },
  { label: '17', value: '17' },
  { label: '18', value: '18' },
  { label: '19', value: '19' },
  { label: '21', value: '21' },
  { label: '22', value: '22' },
  { label: '23', value: '23' },
  { label: '24', value: '24' },
  { label: '25', value: '25' },
  { label: '26', value: '26' },
  { label: '27', value: '27' },
  { label: '28', value: '28' },
  { label: '29', value: '29' },
];

// export const FEBRUARY_DAYS_OPTIONS = {
//   blank: '',
//   1: 1,
//   2: 2,
//   3: 3,
//   4: 4,
//   5: 5,
//   6: 6,
//   7: 7,
//   8: 8,
//   9: 9,
//   10: 10,
//   11: 11,
//   12: 12,
//   13: 13,
//   14: 14,
//   15: 15,
//   16: 16,
//   17: 17,
//   18: 18,
//   19: 19,
//   20: 20,
//   21: 21,
//   22: 22,
//   23: 23,
//   24: 24,
//   25: 25,
//   26: 26,
//   27: 27,
//   28: 28,
//   29: 29,
// };

export const THIRTY_DAYS_OPTIONS = FEBRUARY_DAYS_OPTIONS.concat([
  { label: '30', value: '30' },
]);

// export const THIRTY_DAYS_OPTIONS = {
//   ...FEBRUARY_DAYS_OPTIONS,
//   30: 30,
// };

export const THIRTY_ONE_DAYS_OPTIONS = THIRTY_DAYS_OPTIONS.concat([
  { label: '31', value: '31' },
]);

// export const THIRTY_ONE_DAYS_OPTIONS = {
//   ...THIRTY_DAYS_OPTIONS,
//   31: 31,
// };

// export const determineDaysOptions = (month: string | undefined): number => {
//   if (month === '2') {
//     return 29;
//   } else if (
//     month === '4' ||
//     month === '6' ||
//     month === '9' ||
//     month === '11'
//   ) {
//     return 30;
//   }

//   return 31;
// };

export const determineDaysOptions = (
  month: string | null | undefined,
  februaryDaysOptions: Option[],
  thirtyDaysOptions: Option[],
  thirtyOneDaysOptions: Option[],
): Option[] => {
  if (month === '2') {
    return februaryDaysOptions;
  } else if (
    month === '4' ||
    month === '6' ||
    month === '9' ||
    month === '11'
  ) {
    return thirtyDaysOptions;
  }

  return thirtyOneDaysOptions;
};
