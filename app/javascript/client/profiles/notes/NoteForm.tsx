import React, { FC } from 'react';
import {
  useCreateNoteMutation,
  useUpdateNoteMutation,
} from 'client/graphqlTypes';
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

interface NoteFormData {
  content: string;
}

interface NoteFormProps {
  setFieldToAdd?: (field: string) => void;
  personId?: string;
  initialValues?: NoteFormData;
  noteId?: string;
  setEditFlag?: (bool: boolean) => void;
}

const blankInitialValues: NoteFormData = {
  content: '',
};

export const NoteForm: FC<NoteFormProps> = ({
  setFieldToAdd,
  personId,
  initialValues = blankInitialValues,
  noteId,
  setEditFlag,
}) => {
  const [createNoteMutation] = useCreateNoteMutation();
  const [updateNoteMutation] = useUpdateNoteMutation();

  const handleSubmit = async (
    data: NoteFormData,
    formikHelpers: FormikHelpers<NoteFormData>,
  ) => {
    const { setErrors, setStatus } = formikHelpers;

    if (personId && setFieldToAdd) {
      const createResponse = await createNoteMutation({
        variables: {
          input: {
            content: data.content,
            personId,
          },
        },
      });
      const createErrors = createResponse.data?.createNote.errors;

      if (createErrors) {
        handleFormErrors<NoteFormData>(createErrors, setErrors, setStatus);
      } else {
        setFieldToAdd('');
      }
    } else if (noteId && setEditFlag) {
      const updateResponse = await updateNoteMutation({
        variables: {
          input: {
            noteId,
            content: data.content,
          },
        },
      });
      const updateErrors = updateResponse.data?.updateNote.errors;

      if (updateErrors) {
        handleFormErrors<NoteFormData>(updateErrors, setErrors, setStatus);
      } else {
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
