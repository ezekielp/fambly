import React, { FC } from 'react';
import { useCreateParentChildRelationshipMutation } from 'client/graphqlTypes';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import { gql } from '@apollo/client';
import { handleFormErrors } from 'client/utils/formik';

gql`
  mutation CreateParentChildRelationship(
    $input: CreateParentChildRelationshipInput!
  ) {
    createParentChildRelationship(input: $input) {
      parentChildRelationship {
        id
        parent {
          id
          firstName
          lastName
        }
        child {
          id
          firstName
          lastName
        }
        parentType
        note
      }
      errors {
        path
        message
      }
    }
  }
`;

const ValidationSchema = yup.object().shape({
  parentId: yup.string().required(),
  childId: yup.string().required(),
  parentType: yup.string(),
  note: yup.string(),
});

interface ParentChildFormData {
  parentId: string;
  childId: string;
  parentType?: string;
  note?: string | null | undefined;
}

interface ParentChildFormProps {
  setFieldToAdd?: (field: string) => void;
  initialValues: ParentChildFormData;
  setEditFlag?: (bool: boolean) => void;
}

export const ParentChildForm: FC<ParentChildFormProps> = ({
  setFieldToAdd,
  initialValues,
  setEditFlag,
}) => {
  const [
    createParentChildRelationshipMutation,
  ] = useCreateParentChildRelationshipMutation();

  const handleSubmit = async (
    data: ParentChildFormData,
    formikHelpers: FormikHelpers<ParentChildFormData>,
  ) => {
    const { parentId, childId, parentType, note } = data;
    const { setErrors, setStatus } = formikHelpers;

    const response = await createParentChildRelationshipMutation({
      variables: {
        input: {
          parentId,
          childId,
          parentType: parentType ? parentType : null,
          note: note ? note : null,
        },
      },
    });
    const errors = response.data?.createParentChildRelationship.errors;

    if (errors) {
      handleFormErrors<ParentChildFormData>(errors, setErrors, setStatus);
    } else {
      if (setFieldToAdd) {
        setFieldToAdd('');
      } else if (setEditFlag) {
        setEditFlag(false);
      }
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={ValidationSchema}
    >
      {({ isSubmitting }) => {
        return (
          <Form>
            <button type="submit" disabled={isSubmitting}>
              Save
            </button>
          </Form>
        );
      }}
    </Formik>
  );
};
