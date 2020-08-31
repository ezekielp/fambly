import { Option } from 'client/form/SelectInput';

export const MONTHS: Record<string, unknown> = {
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

export const MONTH_OPTIONS = [
  { label: '', value: '' },
  { label: MONTHS[1], value: '1' },
  { label: MONTHS[2], value: '2' },
  { label: MONTHS[3], value: '3' },
  { label: MONTHS[4], value: '4' },
  { label: MONTHS[5], value: '5' },
  { label: MONTHS[6], value: '6' },
  { label: MONTHS[7], value: '7' },
  { label: MONTHS[8], value: '8' },
  { label: MONTHS[9], value: '9' },
  { label: MONTHS[10], value: '10' },
  { label: MONTHS[11], value: '11' },
  { label: MONTHS[12], value: '12' },
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

export const THIRTY_DAYS_OPTIONS = FEBRUARY_DAYS_OPTIONS.concat([
  { label: '30', value: '30' },
]);

export const THIRTY_ONE_DAYS_OPTIONS = THIRTY_DAYS_OPTIONS.concat([
  { label: '31', value: '31' },
]);

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
