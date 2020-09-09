import React from 'react';
import {
  NoteForm,
  NoteFormData,
  NoteFormProps,
  blankInitialValues,
} from './NoteForm';
import {
  createPersonNoteMutation,
  updateNoteMutation,
} from 'client/test/mutations/note';
import { FormUtils, formUtils } from 'client/test/utils/formik';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { ReactWrapper, mount } from 'enzyme';
import { Form } from 'formik';
import { act } from 'react-dom/test-utils';
import wait from 'waait';

describe('<NoteForm />', () => {
  let mountComponent: (
    mocks?: MockedResponse[],
    props?: NoteFormProps,
  ) => Promise<void>;
  let component: ReactWrapper<NoteFormProps>;
  let createMocks: MockedResponse[];
  let createProps: NoteFormProps;
  let updateProps: NoteFormProps;
  let form: FormUtils;

  beforeEach(() => {
    createMocks = [createPersonNoteMutation()];
    createProps = {
      initialValues: blankInitialValues,
      setFieldToAdd: jest.fn(),
      personId: 'john-von-neumann-uuid',
    };
    updateProps = {
      initialValues: {
        content: 'Current random note of some kind',
      },
      setEditFlag: jest.fn(),
      noteId: 'einstein-note-uuid',
    };

    mountComponent = async (mocks, props) => {
      await act(async () => {
        component = mount(
          <MockedProvider mocks={mocks} addTypename={false}>
            <MemoryRouter
              initialEntries={[{ pathname: '/profiles/john-von-neumann-uuid' }]}
            >
              <Route
                path="/profiles/john-von-neumann-uuid"
                render={() => <NoteForm {...props} />}
              />
            </MemoryRouter>
          </MockedProvider>,
        );
        await wait(0);
        component.update();
      });
    };
  });

  it('exists', async () => {
    await mountComponent(createMocks, createProps);
    expect(component.exists()).toBe(true);
  });

  it('has one field form, for the note content', async () => {
    await mountComponent(createMocks, createProps);
    form = formUtils<NoteFormData>(component.find(Form));

    expect(form.findInputByName('content', 'textarea').exists()).toBe(true);
  });

  describe('form validations', () => {
    it('requires text for the note content', async () => {
      await mountComponent(createMocks, createProps);
      form = formUtils<NoteFormData>(component.find(Form));
      await form.submit();
      expect(
        component
          .text()
          .includes('Please add a note or hit the cancel button!'),
      ).toBe(true);

      await form.fill(
        {
          content:
            "Young man, in mathematics you don't understand things. You just get used to them.",
        },
        'textarea',
      );
      expect(
        component
          .text()
          .includes('Please add a note or hit the cancel button!'),
      ).toBe(false);
    });
  });

  describe('form submission', () => {
    describe('when creating a new note', () => {
      it('submits the form and calls the createPersonNote mutation when the data is valid', async () => {
        const createPersonNote = createPersonNoteMutation();
        await mountComponent([createPersonNote], createProps);
        form = formUtils<NoteFormData>(component.find(Form));
        await form.fill(
          {
            content:
              "Young man, in mathematics you don't understand things. You just get used to them.",
          },
          'textarea',
        );
        await form.submit();
        expect(createPersonNote.newData).toHaveBeenCalled();
      });
    });

    describe('when updating an existing note', () => {
      it('submits the form and calls the updateNote mutation when the data is valid', async () => {
        const updateNote = updateNoteMutation();
        await mountComponent([updateNote], updateProps);
        form = formUtils<NoteFormData>(component.find(Form));
        await form.fill(
          {
            content:
              'I have no special talents. I am only passionately curious.',
          },
          'textarea',
        );
        await form.submit();
        expect(updateNote.newData).toHaveBeenCalled();
      });
    });
  });
});
