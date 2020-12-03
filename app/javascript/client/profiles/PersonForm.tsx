import React, { FC } from 'react';
import {
  useCreatePersonMutation,
  useUpdatePersonMutation,
} from 'client/graphqlTypes';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { FormikTextInput } from 'client/form/inputs';
import { Button } from 'client/common/Button';
import { handleFormErrors } from 'client/utils/formik';
import * as yup from 'yup';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { SectionDivider } from 'client/profiles/PersonContainer';
import { Text } from 'client/common/Text';
import { gql } from '@apollo/client';

gql`
  mutation UpdatePerson($input: UpdatePersonInput!) {
    updatePerson(input: $input) {
      person {
        id
        firstName
        middleName
        lastName
      }
      errors {
        path
        message
      }
    }
  }
`;

const ValidationSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('Please provide at least a first name when adding a new person'),
  lastName: yup.string(),
});

export interface PersonFormData {
  firstName: string;
  middleName: string;
  lastName?: string;
}

export interface PersonFormProps extends RouteComponentProps {
  refetchUserData?: () => void;
  toggleNewPersonFieldVisible?: (state: boolean) => void;
  setEditFlag?: (bool: boolean) => void;
  personId?: string;
  initialValues?: PersonFormData;
  updateMiddleName?: boolean;
  addLastName?: boolean;
  setFieldToAdd?: (field: string) => void;
  setModalOpen?: (bool: boolean) => void;
}

export const blankInitialValues: PersonFormData = {
  firstName: '',
  middleName: '',
  lastName: '',
};

const InternalPersonForm: FC<PersonFormProps> = ({
  refetchUserData,
  toggleNewPersonFieldVisible,
  initialValues = blankInitialValues,
  setEditFlag,
  setModalOpen,
  setFieldToAdd,
  personId,
  updateMiddleName,
  addLastName,
  history,
}) => {
  const [createPersonMutation] = useCreatePersonMutation();
  const [updatePersonMutation] = useUpdatePersonMutation();

  const submitButtonText = toggleNewPersonFieldVisible
    ? 'Create profile'
    : 'Save';

  const cancel = () => {
    if (toggleNewPersonFieldVisible) {
      toggleNewPersonFieldVisible(false);
    } else if (setEditFlag) {
      setEditFlag(false);
      setModalOpen && setModalOpen(false);
    } else if (setFieldToAdd) {
      setFieldToAdd('');
    }
  };

  const handleSubmit = async (
    data: PersonFormData,
    formikHelpers: FormikHelpers<PersonFormData>,
  ) => {
    const { firstName, middleName, lastName } = data;
    const { setErrors, setStatus } = formikHelpers;

    if (toggleNewPersonFieldVisible) {
      const createResponse = await createPersonMutation({
        variables: {
          input: {
            firstName,
            lastName: lastName !== '' ? lastName : null,
          },
        },
      });
      const errors = createResponse.data?.createPerson.errors;

      if (errors) {
        handleFormErrors<PersonFormData>(errors, setErrors, setStatus);
      } else {
        const personId = createResponse.data?.createPerson.person?.id;
        refetchUserData && refetchUserData();
        history.push(`/profiles/${personId}`);
      }
    } else if (personId) {
      const updateResponse = await updatePersonMutation({
        variables: {
          input: {
            personId,
            firstName,
            middleName: middleName ? middleName : null,
            lastName: lastName ? lastName : null,
          },
        },
      });
      const errors = updateResponse.data?.updatePerson.errors;

      if (errors) {
        handleFormErrors<PersonFormData>(errors, setErrors, setStatus);
      } else {
        setFieldToAdd && setFieldToAdd('');
        setEditFlag && setEditFlag(false);
        setModalOpen && setModalOpen(false);
      }
    }
  };

  return (
    <>
      <Text marginBottom={3} fontSize={4} bold>
        Person
      </Text>
      <SectionDivider />
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={ValidationSchema}
      >
        {({ isSubmitting }) => (
          <Form>
            {!updateMiddleName && !addLastName && (
              <Field
                name="firstName"
                label="First name"
                component={FormikTextInput}
              />
            )}
            {!toggleNewPersonFieldVisible && !addLastName && (
              <Field
                name="middleName"
                label={
                  updateMiddleName ? 'Middle name' : 'Middle name (optional)'
                }
                component={FormikTextInput}
              />
            )}
            {!updateMiddleName && (
              <Field
                name="lastName"
                label={addLastName ? 'Last name' : 'Last name (optional)'}
                component={FormikTextInput}
              />
            )}
            <Button marginRight="1rem" type="submit" disabled={isSubmitting}>
              {submitButtonText}
            </Button>
            <Button type="button" onClick={() => cancel()}>
              Cancel
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export const PersonForm = withRouter(InternalPersonForm) as React.ComponentType<
  any
>;
// The type-casting hack above solves a TypeScript error from extending RouteComponentProps
