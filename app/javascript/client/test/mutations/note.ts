import {
  CreatePersonNoteMutation,
  CreatePersonNoteDocument,
  CreatePersonNoteInput,
  UpdateNoteMutation,
  UpdateNoteDocument,
  UpdateNoteInput,
} from 'client/graphqlTypes';
import { MockedResponse } from '@apollo/client/testing';

export const createPersonNoteInput: CreatePersonNoteInput = {
  content:
    "Young man, in mathematics you don't understand things. You just get used to them.",
  personId: 'john-von-neumann-uuid',
};

export const createPersonNoteResult: CreatePersonNoteMutation['createPersonNote'] = {
  errors: null,
  note: {
    id: 'some-note-uuid',
    content:
      "Young man, in mathematics you don't understand things. You just get used to them.",
  },
};

export const createPersonNoteMutation = ({
  input = createPersonNoteInput,
  result = createPersonNoteResult,
} = {}): MockedResponse => ({
  request: {
    query: CreatePersonNoteDocument,
    variables: {
      input,
    },
  },
  result: { data: { createPersonNote: result } },
  newData: jest.fn(() => ({
    data: { createPersonNote: result },
  })),
});

export const updateNoteInput: UpdateNoteInput = {
  content: 'I have no special talents. I am only passionately curious.',
  noteId: 'einstein-note-uuid',
};

export const updateNoteResult: UpdateNoteMutation['updateNote'] = {
  errors: null,
  note: {
    id: 'einstein-note-uuid',
    content: 'I have no special talents. I am only passionately curious.',
  },
};

export const updateNoteMutation = ({
  input = updateNoteInput,
  result = updateNoteResult,
} = {}): MockedResponse => ({
  request: {
    query: UpdateNoteDocument,
    variables: {
      input,
    },
  },
  result: { data: { updateNote: result } },
  newData: jest.fn(() => ({
    data: { updateNote: result },
  })),
});
