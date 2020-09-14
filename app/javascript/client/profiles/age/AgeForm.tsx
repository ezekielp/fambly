import React, { FC } from 'react';
import {
  useCreateAgeMutation,
  useUpdateAgeMutation,
} from 'client/graphqlTypes';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { FormikNumberInput } from 'client/form/inputs';
import { Button } from 'client/common/Button';
import { Text } from 'client/common/Text';
import { SectionDivider } from 'client/profiles/PersonContainer';
import * as yup from 'yup';
import { gql } from '@apollo/client';
import { handleFormErrors } from 'client/utils/formik';

gql`
  mutation CreateAge($input: CreateAgeInput!) {
    createAge(input: $input) {
      person {
        id
        age
        monthsOld
      }
      errors {
        path
        message
      }
    }
  }
`;

export const AgeFormValidationSchema = yup.object().shape({
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
  setFieldToAdd?: (field: string) => void;
  personId: string;
  initialValues?: AgeFormData;
  setEditFlag?: (bool: boolean) => void;
}

const blankInitialValues: AgeFormData = {
  age: null,
  monthsOld: null,
};

export const AgeForm: FC<AgeFormProps> = ({
  setFieldToAdd,
  personId,
  initialValues = blankInitialValues,
  setEditFlag,
}) => {
  const [createAgeMutation] = useCreateAgeMutation();
  const [updateAgeMutation] = useUpdateAgeMutation();

  const cancel = () => {
    if (setFieldToAdd) {
      setFieldToAdd('');
    } else if (setEditFlag) {
      setEditFlag(false);
    }
  };

  const handleSubmit = async (
    data: AgeFormData,
    formikHelpers: FormikHelpers<AgeFormData>,
  ) => {
    const { setErrors, setStatus } = formikHelpers;

    if (setFieldToAdd) {
      const createResponse = await createAgeMutation({
        variables: {
          input: {
            personId,
            ...data,
          },
        },
      });
      const createErrors = createResponse.data?.createAge.errors;
      if (createErrors) {
        handleFormErrors<AgeFormData>(createErrors, setErrors, setStatus);
      } else {
        setFieldToAdd('');
      }
    } else if (setEditFlag) {
      const updateResponse = await updateAgeMutation({
        variables: {
          input: {
            personId,
            ...data,
          },
        },
      });
      const updateErrors = updateResponse.data?.updateAge.errors;
      if (updateErrors) {
        handleFormErrors<AgeFormData>(updateErrors, setErrors, setStatus);
      } else {
        setEditFlag(false);
      }
    }
  };

  return (
    <>
      <Text marginBottom={3} fontSize={4} bold>
        Age
      </Text>
      <SectionDivider />
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={AgeFormValidationSchema}
      >
        {({ isSubmitting }) => (
          <Form>
            <Field name="age" label="Years old" component={FormikNumberInput} />
            <Text marginBottom={5} bold>
              Or
            </Text>
            <Field
              name="monthsOld"
              label="Months old"
              component={FormikNumberInput}
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
