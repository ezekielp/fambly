import React, { FC } from 'react';
import { useCreatePersonMutation } from 'client/graphqlTypes';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { FormikTextInput } from 'client/form/inputs';
import { Button } from 'client/common/Button';
import { handleFormErrors } from 'client/utils/formik';
import * as yup from 'yup';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { SectionDivider } from 'client/profiles/PersonContainer';
import { Text } from 'client/common/Text';

const ValidationSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('Please provide at least a first name when adding a new person'),
  lastName: yup.string(),
});

export interface AddPersonFormProps extends RouteComponentProps {
  refetchUserData?: () => void;
  toggleNewPersonFieldVisible: (state: boolean) => void;
}

export interface AddPersonFormData {
  firstName: string;
  lastName?: string;
}

const InternalAddPersonForm: FC<AddPersonFormProps> = ({
  refetchUserData,
  toggleNewPersonFieldVisible,
  history,
}) => {
  const [createPersonMutation] = useCreatePersonMutation();

  const handleSubmit = async (
    data: AddPersonFormData,
    formikHelpers: FormikHelpers<AddPersonFormData>,
  ) => {
    const { firstName, lastName } = data;
    const response = await createPersonMutation({
      variables: {
        input: {
          firstName,
          lastName: lastName !== '' ? lastName : null,
        },
      },
    });
    const { setErrors, setStatus } = formikHelpers;

    const errors = response.data?.createPerson.errors;
    if (errors) {
      handleFormErrors<AddPersonFormData>(errors, setErrors, setStatus);
    } else {
      const personId = response.data?.createPerson.person?.id;
      refetchUserData && refetchUserData();
      history.push(`/profiles/${personId}`);
    }
  };

  const initialValues: AddPersonFormData = {
    firstName: '',
    lastName: '',
  };

  return (
    <>
      <Text marginBottom={3} fontSize={4} bold>
        New person
      </Text>
      <SectionDivider />
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={ValidationSchema}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field
              name="firstName"
              label="First name"
              component={FormikTextInput}
              type="text"
            />
            <Field
              name="lastName"
              label="Last name (optional)"
              component={FormikTextInput}
              type="text"
            />
            <Button marginRight="1rem" type="submit" disabled={isSubmitting}>
              Create profile
            </Button>
            <Button
              type="button"
              onClick={() => toggleNewPersonFieldVisible(false)}
            >
              Cancel
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export const AddPersonForm = withRouter(
  InternalAddPersonForm,
) as React.ComponentType<any>;
// The type-casting hack above solves a TypeScript error from extending RouteComponentProps
