import React, { FC } from 'react';
import { useCreateOrUpdateBirthdateMutation } from 'client/graphqlTypes';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { FormikNumberInput, FormikSelectInput } from 'client/form/inputs';
import { Button } from 'client/common/Button';
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
  birthMonth: yup
    .string()
    .nullable()
    .when('birthDay', {
      is: (val) => val !== '' && val !== undefined && val !== null,
      then: yup
        .string()
        .required('Month is required if you specify a day')
        .nullable(),
    }),
  birthDay: yup.string().nullable(),
});

export interface BirthdateFormData {
  birthYear?: number | null;
  birthMonth?: string;
  birthDay?: string;
}

export interface BirthdateFormProps {
  setFieldToAdd?: (field: string) => void;
  personId: string;
  initialValues?: BirthdateFormData;
  setEditFlag?: (bool: boolean) => void;
}

export const blankInitialValues = {
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

  const cancel = () => {
    if (setFieldToAdd) {
      setFieldToAdd('');
    } else if (setEditFlag) {
      setEditFlag(false);
    }
  };

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

    const response = await createOrEditBirthdateMutation(variables);
    const errors = response.data?.createOrUpdateBirthdate.errors;

    if (errors) {
      handleFormErrors<BirthdateFormData>(errors, setErrors, setStatus);
    } else {
      if (setFieldToAdd) {
        setFieldToAdd('');
      } else if (setEditFlag) {
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
              label="Year (optional)"
              component={FormikNumberInput}
            />
            <Field
              name="birthMonth"
              label="Month (optional)"
              component={FormikSelectInput}
              options={MONTH_OPTIONS}
            />
            <Field
              name="birthDay"
              label="Day (optional)"
              component={FormikSelectInput}
              options={daysOptions}
            />
            <Button marginRight="1rem" type="submit" disabled={isSubmitting}>
              Save
            </Button>
            <Button onClick={() => cancel()}>Cancel</Button>
          </Form>
        );
      }}
    </Formik>
  );
};
