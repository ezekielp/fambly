import React, { FC } from 'react';
import { useCreateEmailMutation } from 'client/graphqlTypes';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { EMAIL_TYPE_OPTIONS } from './utils';
import { Button } from 'client/common/Button';
import { Text } from 'client/common/Text';
import { SectionDivider } from 'client/profiles/PersonContainer';
import * as yup from 'yup';
import { gql } from '@apollo/client';
import { handleFormErrors } from 'client/utils/formik';
import { FormikSelectInput, FormikTextInput } from 'client/form/inputs';

gql`
  mutation CreateEmail($input: CreateEmailInput!) {
    createEmail(input: $input) {
      email {
        id
        email
        emailType
      }
      errors {
        path
        message
      }
    }
  }
`;

export const EmailFormValidationSchema = yup.object().shape({
  email: yup.string().required().email().label('Email'),
  emailType: yup.string(),
});

export interface EmailFormData {
  email: string;
  emailType?: string;
}

export interface EmailFormProps {
  setFieldToAdd?: (field: string) => void;
  personId: string;
  initialValues?: EmailFormData;
  setEditFlag?: (bool: boolean) => void;
  setModalOpen?: (bool: boolean) => void;
}

export const blankInitialValues: EmailFormData = {
  email: '',
  emailType: '',
};

export const EmailForm: FC<EmailFormProps> = ({
  setFieldToAdd,
  personId,
  initialValues = blankInitialValues,
  setEditFlag,
  setModalOpen,
}) => {
  const [createEmailMutation] = useCreateEmailMutation();

  const cancel = () => {
    if (setFieldToAdd) {
      setFieldToAdd('');
    } else if (setEditFlag && setModalOpen) {
      setEditFlag(false);
      setModalOpen(false);
    }
  };

  const handleSubmit = async (
    data: EmailFormData,
    formikHelpers: FormikHelpers<EmailFormData>,
  ) => {
    const { email, emailType } = data;
    if (!email) return;
    const { setErrors, setStatus } = formikHelpers;

    const response = await createEmailMutation({
      variables: {
        input: {
          personId,
          email,
          emailType: emailType ? emailType : null,
        },
      },
    });
    const errors = response.data?.createEmail.errors;

    if (errors) {
      handleFormErrors<EmailFormData>(errors, setErrors, setStatus);
    } else {
      if (setFieldToAdd) {
        setFieldToAdd('');
      } else if (setEditFlag) {
        setEditFlag(false);
        setModalOpen && setModalOpen(false);
      }
    }
  };

  return (
    <>
      <Text marginBottom={3} fontSize={4} bold>
        Email
      </Text>
      <SectionDivider />
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={EmailFormValidationSchema}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field
              name="email"
              label="Email address"
              component={FormikTextInput}
            />
            <Field
              name="emailType"
              label="Type (optional)"
              component={FormikSelectInput}
              options={EMAIL_TYPE_OPTIONS}
            />
            <Button marginRight="1rem" type="submit" disabled={isSubmitting}>
              Save
            </Button>
            <Button onClick={() => cancel()}>Cancel</Button>
          </Form>
        )}
      </Formik>
    </>
  );
};
