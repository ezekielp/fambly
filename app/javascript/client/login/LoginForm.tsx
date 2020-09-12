import React, { FC } from 'react';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { FormikTextInput } from '../form/inputs';
import { GlobalError } from '../common/GlobalError';
import { Button } from 'client/common/Button';
import { BelowNavContainer } from 'client/common/BelowNavContainer';
import { OnSubmit, handleFormErrors } from 'client/utils/formik';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { LoginMutation } from 'client/graphqlTypes';
import * as yup from 'yup';
import styled from 'styled-components';
import { text, spacing } from 'client/shared/styles';

export const Header = styled.h1`
  font-size: ${text[3]};
  font-weight: 700;
  margin-bottom: ${spacing[2]};
`;

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
    .email()
    .required(
      'Please enter the email address associated with your Fambly account',
    ),
  password: yup
    .string()
    .required('Please enter the password associated with your Fambly account'),
});

const InternalLoginForm: FC<LoginFormProps & RouteComponentProps> = ({
  onSubmit,
  initialValues,
}) => {
  const handleSubmit = async (
    data: LoginFormData,
    formikHelpers: FormikHelpers<LoginFormData>,
  ) => {
    const response = await onSubmit(data);
    const { setErrors, setStatus } = formikHelpers;

    const errors = response.data?.login.errors;
    if (errors) {
      handleFormErrors<LoginFormData>(errors, setErrors, setStatus);
    }
  };

  return (
    <BelowNavContainer>
      <Header>Log in</Header>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={ValidationSchema}
      >
        {({ isSubmitting, status }) => (
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
            {status && <GlobalError>{status}</GlobalError>}
            <Button type="submit" disabled={isSubmitting}>
              Log in
            </Button>
          </Form>
        )}
      </Formik>
    </BelowNavContainer>
  );
};

export const LoginForm = withRouter(InternalLoginForm);
