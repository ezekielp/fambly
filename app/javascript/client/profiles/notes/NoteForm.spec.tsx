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
  let updateMocks: MockedResponse[];
  let updateProps: NoteFormProps;
  let form: FormUtils;

  beforeEach(() => {
    createMocks = [createPersonNoteMutation()];
    createProps = {
      initialValues: blankInitialValues,
      setFieldToAdd: jest.fn(),
      personId: 'john-von-neumann-uuid',
    };
    updateMocks = [updateNoteMutation()];
    updateProps = {
      initialValues: {
        content: 'Current random note of some kind',
      },
      setFieldToAdd: jest.fn(),
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
    it.only('requires text for the note content', async () => {
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
});
