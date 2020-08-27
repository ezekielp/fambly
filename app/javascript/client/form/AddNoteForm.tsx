import React, { FC } from 'react';
import { useCreateNoteMutation } from 'client/graphqlTypes';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { handleFormErrors } from 'client/utils/formik';
import * as yup from 'yup';
import { gql } from '@apollo/client';

gql`
  mutation CreateNote($input: CreateNoteInput!) {
    createNote(input: $input) {
      note {
        id
        content
      }
      errors {
        path
        message
      }
    }
  }
`;

const ValidationSchema = yup.object().shape({
  content: yup.string().required(),
});

interface AddNoteFormProps {
  setFieldToAdd: (field: string) => void;
  personId: string;
}

interface AddNoteFormData {
  content: string;
}

export const AddNoteForm: FC<AddNoteFormProps> = ({
  setFieldToAdd,
  personId,
}) => {
  const [createNoteMutation] = useCreateNoteMutation();

  const initialValues: AddNoteFormData = {
    content: '',
  };

  const handleSubmit = async (
    data: AddNoteFormData,
    formikHelpers: FormikHelpers<AddNoteFormData>,
  ) => {
    const response = await createNoteMutation({
      variables: {
        input: {
          content: data.content,
          personId,
        },
      },
    });
    const { setErrors, setStatus } = formikHelpers;

    const errors = response.data?.createNote.errors;
    if (errors) {
      handleFormErrors<AddNoteFormData>(errors, setErrors, setStatus);
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
          <Field name="content" component="textarea" />
          <button type="submit" disabled={isSubmitting}>
            Create note
          </button>
        </Form>
      )}
    </Formik>
  );
};
