import React, { FC } from 'react';
import { useCreateAgeMutation } from 'client/graphqlTypes';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { FormikNumberInput } from 'client/form/inputs';
import * as yup from 'yup';
import { gql } from '@apollo/client';
import { handleFormErrors } from 'client/utils/formik';

gql`
  mutation CreateAge($input: CreateAgeInput!) {
    createAge(input: $input) {
      person {
        id
        age
        ageInMonths
      }
      errors {
        path
        message
      }
    }
  }
`;

const ValidationSchema = yup.object().shape({
  age: yup
    .number()
    .integer()
    .positive()
    .max(1000000, "Wow, that's old! Please enter a lower age")
    .nullable(),
  monthsOld: yup
    .number()
    .integer()
    .positive()
    .max(1000000, "Wow, that's old! Please enter a lower age")
    .nullable(),
});

interface AgeFormData {
  age?: number | null;
  monthsOld?: number | null;
}

interface AgeFormProps {
  setFieldToAdd: (field: string) => void;
  personId: string;
  initialValues?: AgeFormData;
}

const blankInitialValues: AgeFormData = {
  age: null,
  monthsOld: null,
};

export const AgeForm: FC<AgeFormProps> = ({
  setFieldToAdd,
  personId,
  initialValues = blankInitialValues,
}) => {
  const [createAgeMutation] = useCreateAgeMutation();

  const handleSubmit = async (
    data: AgeFormData,
    formikHelpers: FormikHelpers<AgeFormData>,
  ) => {
    const response = await createAgeMutation({
      variables: {
        input: {
          personId,
          ...data,
        },
      },
    });
    const { setErrors, setStatus } = formikHelpers;

    const errors = response.data?.createAge.errors;
    if (errors) {
      handleFormErrors<AgeFormData>(errors, setErrors, setStatus);
    } else {
      setFieldToAdd('');
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
          <Field name="age" label="Age" component={FormikNumberInput} />
          <Field
            name="monthsOld"
            label="Months old"
            component={FormikNumberInput}
          />
          <button type="submit" disabled={isSubmitting}>
            Save
          </button>
        </Form>
      )}
    </Formik>
  );
};
