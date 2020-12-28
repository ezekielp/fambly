import { UserPersonInfoFragment } from 'client/graphqlTypes';
import * as yup from 'yup';

export const TripFormValidationSchema = yup.object().shape({
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
  newOrCurrentContact: yup.string().required(),
  firstName: yup.string().when('newOrCurrentContact', {
    is: (val: string) => val === 'new_person',
    then: yup
      .string()
      .required(
        "To create a new contact, you need to provide at least the person's first name",
      ),
  }),
});

export const sortPeople = (
  people: UserPersonInfoFragment[],
): UserPersonInfoFragment[] => {
  return people.sort((p1, p2) => {
    const firstName1 = p1.firstName.toUpperCase();
    const firstName2 = p2.firstName.toUpperCase();
    if (firstName1 < firstName2) {
      return -1;
    } else if (firstName1 > firstName2) {
      return 1;
    } else {
      const lastName1 = p1.lastName ? p1.lastName.toUpperCase() : '';
      const lastName2 = p2.lastName ? p2.lastName.toUpperCase() : '';
      if (lastName1 < lastName2) {
        return -1;
      } else if (lastName1 > lastName2) {
        return 1;
      }
      return 0;
    }
  });
};
