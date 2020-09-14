import React, { FC, useState } from 'react';
import { useDeleteNoteMutation } from 'client/graphqlTypes';
import { NoteForm } from './NoteForm';
import { Note } from './NotesContainer';
import { ProfileFieldContainer } from 'client/common/ProfileFieldContainer';
import { Dropdown } from 'client/common/Dropdown';
import { gql } from '@apollo/client';
import { colors } from 'client/shared/styles';
import { Modal } from 'client/common/Modal';
import { Text } from 'client/common/Text';
import { Button } from 'client/common/Button';
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
  const [modalOpen, setModalOpen] = useState(false);

  const deleteNote = async () => {
    await deleteNoteMutation({
      variables: {
        input: {
          noteId: id,
        },
      },
    });
    setDeletedFlag(true);
    setModalOpen(false);
  };

  const dropdownItems = [
    { label: 'Edit', onClick: () => setEditFlag(true) },
    { label: 'Delete', onClick: () => setModalOpen(true) },
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
            xMarkSize="20"
            sandwichSize="20"
            color={colors.orange}
            topSpacing="30px"
          />
        </ProfileFieldContainer>
      )}
      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <Text marginBottom={3} fontSize={3} bold>
            Are you sure you want to delete this field?
          </Text>
          <Button marginRight="1rem" onClick={() => deleteNote()}>
            Yes
          </Button>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
        </Modal>
      )}
    </>
  );
};
