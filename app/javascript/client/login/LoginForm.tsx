import React, { FC } from 'react';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { OnSubmit, handleFormErrors } from 'client/utils/formik';
import { LoginMutation } from 'client/graphqlTypes';
import * as yup from 'yup';

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormProps {
  onSubmit: OnSubmit<LoginFormData, LoginMutation>;
  initialValues: LoginFormData;
}

const ValidationSchema = yup.object().shape({
  email: yup
    .string()
    .required(
      'Please enter the email address associated with your Fambly account',
    ),
  password: yup
    .string()
    .required()
    .label('Please enter the password associated with your Fambly account'),
});

export const LoginForm: FC<LoginFormProps> = ({ onSubmit, initialValues }) => {
  const handleSubmit = async (
    data: LoginFormData,
    formikHelpers: FormikHelpers<LoginFormData>,
  ) => {};

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={ValidationSchema}
    >
      {({ isSubmitting, status }) => <Form></Form>}
    </Formik>
  );
};
