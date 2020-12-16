import React, { FC } from 'react';
import {
  useCreateEmailMutation,
  useUpdateEmailMutation,
} from 'client/graphqlTypes';
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
        emailAddress
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
  emailAddress: yup.string().required().email().label('Email'),
  emailType: yup.string(),
});

export interface EmailFormData {
  emailAddress: string;
  emailType?: string;
}

export interface EmailFormProps {
  setFieldToAdd?: (field: string) => void;
  personId?: string;
  initialValues?: EmailFormData;
  emailId?: string;
  setEditFlag?: (bool: boolean) => void;
  setModalOpen?: (bool: boolean) => void;
}

export const blankInitialValues: EmailFormData = {
  emailAddress: '',
  emailType: '',
};

export const EmailForm: FC<EmailFormProps> = ({
  setFieldToAdd,
  personId,
  initialValues = blankInitialValues,
  emailId,
  setEditFlag,
  setModalOpen,
}) => {
  const [createEmailMutation] = useCreateEmailMutation();
  const [updateEmailMutation] = useUpdateEmailMutation();

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
    const { emailAddress, emailType } = data;
    if (!emailAddress) return;
    const { setErrors, setStatus } = formikHelpers;

    if (personId && setFieldToAdd) {
      const createResponse = await createEmailMutation({
        variables: {
          input: {
            personId,
            emailAddress,
            emailType: emailType ? emailType : null,
          },
        },
      });
      const createErrors = createResponse.data?.createEmail.errors;
      if (createErrors) {
        handleFormErrors<EmailFormData>(createErrors, setErrors, setStatus);
      } else {
        setFieldToAdd('');
      }
    } else if (emailId && setEditFlag) {
      const updateResponse = await updateEmailMutation({
        variables: {
          input: {
            emailId,
            emailAddress,
            emailType: emailType ? emailType : null,
          },
        },
      });
      const updateErrors = updateResponse.data?.updateEmail.errors;
      if (updateErrors) {
        handleFormErrors<EmailFormData>(updateErrors, setErrors, setStatus);
      } else {
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
              name="emailAddress"
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
