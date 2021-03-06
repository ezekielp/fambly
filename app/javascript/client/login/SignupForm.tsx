import React, { FC } from 'react';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { FormikTextInput } from 'client/form/inputs';
import { Button } from 'client/common/Button';
import { BelowNavContainer } from 'client/common/BelowNavContainer';
import { OnSubmit, handleFormErrors } from 'client/utils/formik';
import { CreateUserMutation } from 'client/graphqlTypes';
import * as yup from 'yup';
import { Header } from 'client/login/LoginForm';
import { Text } from 'client/common/Text';
import { colors } from 'client/shared/styles';

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
  reachedTrialLimit?: boolean;
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
  reachedTrialLimit,
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
    } else {
      window.location.href = '/home';
    }
  };

  return (
    <BelowNavContainer>
      {reachedTrialLimit && (
        <Text fontSize={3} marginBottom={3} bold center color={colors.red}>
          Please create an account to continue using Fambly!
        </Text>
      )}
      <Header>Sign up</Header>
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
            <Button type="submit" disabled={isSubmitting}>
              Sign up
            </Button>
          </Form>
        )}
      </Formik>
    </BelowNavContainer>
  );
};
