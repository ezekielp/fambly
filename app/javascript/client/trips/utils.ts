import * as yup from 'yup';

const TripFormValidationSchema = yup.object().shape({
  name: yup.string().required('Please give a name to this trip!'),
  departureYear: yup
    .number()
    .integer()
    .positive()
    .nullable()
    .when('departureMonth', {
      is: (val) => val !== '' && val !== undefined && val !== null,
      then: yup
        .string()
        .required('Year is required if you specify a month')
        .nullable(),
    }),
  departureMonth: yup
    .string()
    .nullable()
    .when('departureDay', {
      is: (val) => val !== '' && val !== undefined && val !== null,
      then: yup
        .string()
        .required('Month is required if you specify a day')
        .nullable(),
    }),
  departureDay: yup.string().nullable(),
  endYear: yup
    .number()
    .integer()
    .positive()
    .nullable()
    .when('endMonth', {
      is: (val) => val !== '' && val !== undefined && val !== null,
      then: yup
        .string()
        .required('Year is required if you specify a month')
        .nullable(),
    }),
  endMonth: yup
    .string()
    .nullable()
    .when('endDay', {
      is: (val) => val !== '' && val !== undefined && val !== null,
      then: yup
        .string()
        .required('Month is required if you specify a day')
        .nullable(),
    }),
  endDay: yup.string().nullable(),
});
