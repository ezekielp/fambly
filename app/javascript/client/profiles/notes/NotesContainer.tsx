import React, { FC } from 'react';
import { NoteItem } from './NoteItem';

export interface Note {
  id: string;
  content: string;
}

interface NotesContainerProps {
  notes: Note[];
}

export const NotesContainer: FC<NotesContainerProps> = ({ notes }) => {
  const noteComponents = notes.map((note) => (
    <NoteItem note={note} key={note.id} />
  ));
  return <>{noteComponents}</>;
};
