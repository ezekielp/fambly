import React, { FC } from 'react';
import { useCreateOrUpdateBirthdateMutation } from 'client/graphqlTypes';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { FormikNumberInput, FormikSelectInput } from 'client/form/inputs';
import {
  MONTH_OPTIONS,
  determineDaysOptions,
  FEBRUARY_DAYS_OPTIONS,
  THIRTY_DAYS_OPTIONS,
  THIRTY_ONE_DAYS_OPTIONS,
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
  birthMonth?: string;
  birthDay?: string;
}

interface BirthdateFormProps {
  setFieldToAdd?: (field: string) => void;
  personId: string;
  initialValues?: BirthdateFormData;
  setEditFlag?: (bool: boolean) => void;
}

const blankInitialValues = {
  birthYear: null,
  birthMonth: '',
  birthDay: '',
};

export const BirthdateForm: FC<BirthdateFormProps> = ({
  setFieldToAdd,
  personId,
  initialValues = blankInitialValues,
  setEditFlag,
}) => {
  const [createOrEditBirthdateMutation] = useCreateOrUpdateBirthdateMutation();

  const handleSubmit = async (
    data: BirthdateFormData,
    formikHelpers: FormikHelpers<BirthdateFormData>,
  ) => {
    const { birthYear, birthMonth, birthDay } = data;
    const { setErrors, setStatus } = formikHelpers;
    const variables: Record<string, unknown> = {
      variables: {
        input: {
          birthYear,
          birthMonth: birthMonth ? parseInt(birthMonth) : null,
          birthDay: birthDay ? parseInt(birthDay) : null,
          personId,
        },
      },
    };

    if (setFieldToAdd) {
      const createResponse = await createOrEditBirthdateMutation(variables);
      const createErrors = createResponse.data?.createOrUpdateBirthdate.errors;

      if (createErrors) {
        handleFormErrors<BirthdateFormData>(createErrors, setErrors, setStatus);
      } else {
        setFieldToAdd('');
      }
    } else if (setEditFlag) {
      const createResponse = await createOrEditBirthdateMutation(variables);
      const createErrors = createResponse.data?.createOrUpdateBirthdate.errors;

      if (createErrors) {
        handleFormErrors<BirthdateFormData>(createErrors, setErrors, setStatus);
      } else {
        setEditFlag(false);
      }
    }
  };

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
