import React, { FC } from 'react';
import { useCreatePersonMutation } from 'client/graphqlTypes';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { FormikTextInput } from 'client/form/inputs';
import { handleFormErrors } from 'client/utils/formik';
import * as yup from 'yup';
import { withRouter, RouteComponentProps } from 'react-router-dom';

const ValidationSchema = yup.object().shape({
  firstName: yup.string().required(),
  lastName: yup.string(),
});

interface AddPersonFormProps {}

interface AddPersonFormData {
  firstName: string;
  lastName?: string;
}

const InternalAddPersonForm: FC<AddPersonFormProps & RouteComponentProps> = ({
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
      history.push(`/profiles/${personId}`);
    }
  };

  const initialValues: AddPersonFormData = {
    firstName: '',
    lastName: '',
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
          <button type="submit" disabled={isSubmitting}>
            Create profile
          </button>
        </Form>
      )}
    </Formik>
  );
};

export const AddPersonForm = withRouter(InternalAddPersonForm);