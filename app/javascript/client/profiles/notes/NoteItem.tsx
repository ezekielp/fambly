import React, { FC } from 'react';
import { Note } from './NotesContainer';

interface NoteProps {
  note: Note;
}

export const NoteItem: FC<NoteProps> = ({ note }) => {
  return <div>{note.content}</div>;
};
