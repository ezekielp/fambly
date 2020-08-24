import React, { FC } from 'react';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { FormikTextInput } from '../form/inputs';
import { OnSubmit, handleFormErrors } from 'client/utils/formik';
import { CreateUserMutation } from 'client/graphqlTypes';
import * as yup from 'yup';

export interface SignupFormData {
  email: string;
  password: string;
  confirmedPassword: string;
}

export interface CreateUserData {
  email: string;
  password: string;
}

export interface SignupFormProps {
  onSubmit: OnSubmit<CreateUserData, CreateUserMutation>;
  initialValues: SignupFormData;
}

const ValidationSchema = yup.object().shape({
  email: yup.string().email().required().label('Email'),
  password: yup.string().required().min(8).label('Password'),
  confirmedPassword: yup
    .string()
    .required()
    .oneOf([yup.ref('password')], 'Passwords must match'),
});

export const SignupForm: FC<SignupFormProps> = ({
  onSubmit,
  initialValues,
}) => {
  const handleSubmit = async (
    data: SignupFormData,
    formikHelpers: FormikHelpers<SignupFormData>,
  ) => {
    const { email, password } = data;
    const response = await onSubmit({
      email,
      password,
    });
    const { setErrors, setStatus } = formikHelpers;

    const errors = response.data?.createUser.errors;
    if (errors) {
      handleFormErrors<SignupFormData>(errors, setErrors, setStatus);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={ValidationSchema}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field
            name="email"
            label="Email address"
            component={FormikTextInput}
            type="email"
          />
          <Field
            name="password"
            label="Password"
            type="password"
            component={FormikTextInput}
          />
          <Field
            name="confirmedPassword"
            label="Confirm password"
            type="password"
            component={FormikTextInput}
          />
          <button type="submit" disabled={isSubmitting}>
            Sign Up
          </button>
        </Form>
      )}
    </Formik>
  );
};
