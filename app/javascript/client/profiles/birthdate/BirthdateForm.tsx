import React, { FC } from 'react';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { gql } from '@apollo/client';
import { handleFormErrors } from 'client/utils/formik';

gql`
  mutation CreateBirthdate($input: CreateBirthdateInput!) {
    createBirthdate(input: $input) {
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
}) => {};
