import React, { FC } from 'react';
import { useCreateNoteMutation } from 'client/graphqlTypes';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { FormikTextArea } from 'client/form/inputs';
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

interface AddNoteFormData {
  content: string;
}

interface AddNoteFormProps {
  setFieldToAdd: (field: string) => void;
  personId: string;
  initialValues?: AddNoteFormData;
}

const blankInitialValues: AddNoteFormData = {
  content: '',
};

export const AddNoteForm: FC<AddNoteFormProps> = ({
  setFieldToAdd,
  personId,
  initialValues = blankInitialValues,
}) => {
  const [createNoteMutation] = useCreateNoteMutation();

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
          <Field name="content" label="Note" component={FormikTextArea} />
          <button type="submit" disabled={isSubmitting}>
            Create note
          </button>
        </Form>
      )}
    </Formik>
  );
};
