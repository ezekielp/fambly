import React, { FC } from 'react';
import {
  useCreatePersonNoteMutation,
  useUpdateNoteMutation,
} from 'client/graphqlTypes';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { FormikTextArea } from 'client/form/inputs';
import { Button } from 'client/common/Button';
import { handleFormErrors } from 'client/utils/formik';
import * as yup from 'yup';
import { gql } from '@apollo/client';

gql`
  mutation CreatePersonNote($input: CreatePersonNoteInput!) {
    createPersonNote(input: $input) {
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
  content: yup.string().required('Please add a note or hit the cancel button!'),
});

export interface NoteFormData {
  content: string;
}

export interface NoteFormProps {
  setFieldToAdd?: (field: string) => void;
  personId?: string;
  initialValues?: NoteFormData;
  noteId?: string;
  setEditFlag?: (bool: boolean) => void;
}

export const blankInitialValues: NoteFormData = {
  content: '',
};

export const NoteForm: FC<NoteFormProps> = ({
  setFieldToAdd,
  personId,
  initialValues = blankInitialValues,
  noteId,
  setEditFlag,
}) => {
  const [createPersonNoteMutation] = useCreatePersonNoteMutation();
  const [updateNoteMutation] = useUpdateNoteMutation();

  const cancel = () => {
    if (setFieldToAdd) {
      setFieldToAdd('');
    } else if (setEditFlag) {
      setEditFlag(false);
    }
  };

  const handleSubmit = async (
    data: NoteFormData,
    formikHelpers: FormikHelpers<NoteFormData>,
  ) => {
    const { setErrors, setStatus } = formikHelpers;

    if (personId && setFieldToAdd) {
      const createResponse = await createPersonNoteMutation({
        variables: {
          input: {
            content: data.content,
            personId,
          },
        },
      });
      const createErrors = createResponse.data?.createPersonNote.errors;

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
          <Button marginRight="1rem" type="submit" disabled={isSubmitting}>
            Save
          </Button>
          <Button onClick={() => cancel()}>Cancel</Button>
        </Form>
      )}
    </Formik>
  );
};
