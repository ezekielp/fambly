import React, { FC, useState } from 'react';
import { useDeleteNoteMutation } from 'client/graphqlTypes';
import { NoteForm } from './NoteForm';
import { Note } from './NotesContainer';
import { gql } from '@apollo/client';

gql`
  mutation UpdateNote($input: UpdateNoteInput!) {
    updateNote(input: $input) {
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

gql`
  mutation DeleteNote($input: DeleteNoteInput!) {
    deleteNote(input: $input)
  }
`;

interface NoteProps {
  note: Note;
}

export const NoteItem: FC<NoteProps> = ({ note }) => {
  const { id, content } = note;
  const [deleteNoteMutation] = useDeleteNoteMutation();
  const [editFlag, setEditFlag] = useState(false);
  const [deletedFlag, setDeletedFlag] = useState(false);

  const deleteNote = async () => {
    await deleteNoteMutation({
      variables: {
        input: {
          noteId: id,
        },
      },
    });
    setDeletedFlag(true);
  };

  const noteItemContent = !deletedFlag ? (
    <>
      <div>{content}</div>
      <button onClick={() => setEditFlag(true)}>Edit</button>
      <button onClick={() => deleteNote()}>Delete</button>
    </>
  ) : (
    <></>
  );

  const initialValues = {
    content,
  };

  const editNoteForm = (
    <NoteForm
      initialValues={initialValues}
      noteId={id}
      setEditFlag={setEditFlag}
    />
  );

  return editFlag ? editNoteForm : noteItemContent;
};
