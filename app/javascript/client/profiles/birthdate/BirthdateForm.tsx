import React, { FC } from 'react';
// import {  } from 'client/graphqlTypes';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { FormikNumberInput, FormikSelectInput } from 'client/form/inputs';
import {
  FEBRUARY_DAYS_OPTIONS,
  THIRTY_DAYS_OPTIONS,
  THIRTY_ONE_DAYS_OPTIONS,
  MONTH_OPTIONS,
  determineDaysOptions,
} from './utils';
import * as yup from 'yup';
import { gql } from '@apollo/client';
import { handleFormErrors } from 'client/utils/formik';

gql`
  mutation CreateOrUpdateBirthdate($input: CreateOrUpdateBirthdateInput!) {
    createOrUpdateBirthdate(input: $input) {
      person {
        id
        age
        monthsOld
        birthYear
        birthMonth
        birthDay
      }
      errors {
        path
        message
      }
    }
  }
`;

const today = new Date();

const ValidationSchema = yup.object().shape({
  birthYear: yup
    .number()
    .integer()
    .positive()
    .max(today.getFullYear())
    .nullable(),
  birthMonth: yup.number().integer().positive().max(12).nullable(),
  birthDay: yup.number().integer().positive().max(31).nullable(),
});

interface BirthdateFormData {
  birthYear?: number | null;
  birthMonth?: number | null;
  birthDay?: number | null;
}

interface BirthdateFormProps {
  setFieldToAdd?: (field: string) => void;
  personId: string;
  initialValues?: BirthdateFormData;
  setEditFlag?: (bool: boolean) => void;
}

const blankInitialValues = {
  birthYear: null,
  birthMonth: null,
  birthDay: null,
};

export const BirthdateForm: FC<BirthdateFormProps> = ({
  setFieldToAdd,
  personId,
  initialValues = blankInitialValues,
  setEditFlag,
}) => {
  // const [createBirthdateMutation] = useCreateBirthdateMutation();

  const handleSubmit = async (
    data: BirthdateFormData,
    formikHelpers: FormikHelpers<BirthdateFormData>,
  ) => {};

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={ValidationSchema}
    >
      {({ values, isSubmitting }) => {
        const daysOptions = determineDaysOptions(
          values.birthMonth,
          FEBRUARY_DAYS_OPTIONS,
          THIRTY_DAYS_OPTIONS,
          THIRTY_ONE_DAYS_OPTIONS,
        );

        return (
          <Form>
            <Field
              name="birthYear"
              label="Year"
              component={FormikNumberInput}
            />
            <Field
              name="birthMonth"
              label="Month"
              component={FormikSelectInput}
              options={MONTH_OPTIONS}
            />
            <Field
              name="birthDay"
              label="Day"
              component={FormikSelectInput}
              options={daysOptions}
            />
            <button type="submit" disabled={isSubmitting}>
              Save
            </button>
          </Form>
        );
      }}
    </Formik>
  );
};
