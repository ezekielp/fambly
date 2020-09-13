import React, { FC, useState } from 'react';
import { useDeleteNoteMutation } from 'client/graphqlTypes';
import { NoteForm } from './NoteForm';
import { Note } from './NotesContainer';
import { ProfileFieldContainer } from 'client/common/ProfileFieldContainer';
import { Dropdown } from 'client/common/Dropdown';
import { gql } from '@apollo/client';
import { colors } from 'client/shared/styles';
import styled from 'styled-components';

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

const NoteTextContainer = styled.div`
  border: 1px solid lightgray;
  border-radius: 6px;
  padding: 1rem;
  width: 89%;
  margin-right: 10px;
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

  const dropdownItems = [
    { label: 'Edit', onClick: () => setEditFlag(true) },
    { label: 'Delete', onClick: () => deleteNote() },
  ];

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

  return editFlag ? (
    editNoteForm
  ) : (
    <>
      {!deletedFlag && (
        <ProfileFieldContainer>
          <NoteTextContainer>{content}</NoteTextContainer>
          <Dropdown
            menuItems={dropdownItems}
            xMarkSize="15"
            sandwichSize="20"
            color={colors.orange}
            topSpacing="30px"
          />
        </ProfileFieldContainer>
      )}
    </>
  );
};
