import React from 'react';
import {
  ParentForm,
  ParentFormData,
  ParentFormProps,
  blankInitialValues,
} from './ParentForm';
import { FormUtils, formUtils } from 'client/test/utils/formik';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { createParentChildRelationshipMutation } from 'client/test/mutations/createParentChild';
import { getUserForHomeContainerQuery } from 'client/test/queries/getUserForHomeContainer';
import { createAgeMutation } from 'client/test/mutations/createAge';
import { createPersonMutation } from 'client/test/mutations/addPerson';
import { ReactWrapper, mount } from 'enzyme';
import { Form } from 'formik';
import { act } from 'react-dom/test-utils';
import wait from 'waait';
import * as formikHelpers from 'client/utils/formik';

describe('<ParentChildForm />', () => {
  let mountComponent: (
    mocks?: MockedResponse[],
    props?: ParentFormProps,
  ) => Promise<void>;
  let component: ReactWrapper<ParentFormProps>;
  let form: FormUtils;
  let defaultMocks: MockedResponse[];
  let defaultProps: ParentFormProps;
  let currentPersonProps: ParentFormProps;

  beforeEach(() => {
    defaultProps = {
      initialValues: blankInitialValues,
      personFirstName: 'Ada',
      setFieldToAdd: jest.fn(),
      childId: 'ada-lovelace-uuid',
    };
    defaultMocks = [
      createParentChildRelationshipMutation(),
      getUserForHomeContainerQuery(),
      createAgeMutation(),
      createPersonMutation(),
    ];
    currentPersonProps = {
      ...defaultProps,
      initialValues: {
        ...blankInitialValues,
        newOrCurrentContact: 'current_person',
      },
    };

    mountComponent = async (mocks = defaultMocks, props = defaultProps) => {
      await act(async () => {
        component = mount(
          <MockedProvider mocks={mocks} addTypename={false}>
            <MemoryRouter
              initialEntries={[{ pathname: '/profiles/ada-lovelace-uuid' }]}
            >
              <Route
                path="/profiles/ada-lovelace-uuid"
                render={() => <ParentForm {...props} />}
              />
              ;
            </MemoryRouter>
          </MockedProvider>,
        );
        await wait(0);
        component.update();
      });
    };
  });

  it('exists', async () => {
    await mountComponent();
    expect(component.exists()).toBe(true);
  });

  it('has eight form fields when the parent to be added is a new_contact', async () => {
    await mountComponent();
    form = formUtils<ParentFormData>(component.find(Form));

    expect(component.find(Form).exists()).toBe(true);

    expect(form.findInputByName('newOrCurrentContact').exists()).toBe(true);
    expect(form.findInputByName('showOnDashboard').exists()).toBe(true);
    expect(form.findInputByName('firstName').exists()).toBe(true);
    expect(form.findInputByName('lastName').exists()).toBe(true);
    expect(form.findInputByName('age').exists()).toBe(true);
    expect(form.findInputByName('monthsOld').exists()).toBe(true);
    expect(form.findInputByName('parentType', 'select').exists()).toBe(true);
    expect(form.findInputByName('note', 'textarea').exists()).toBe(true);
  });

  it('has four form fields when the parent to be added is a current_contact', async () => {
    await mountComponent(defaultMocks, currentPersonProps);
    form = formUtils<ParentFormData>(component.find(Form));

    expect(form.findInputByName('newOrCurrentContact').exists()).toBe(true);
    expect(form.findInputByName('formParentId', 'select').exists()).toBe(true);
    expect(form.findInputByName('parentType', 'select').exists()).toBe(true);
    expect(form.findInputByName('note', 'textarea').exists()).toBe(true);
  });

  describe('form validations', () => {
    describe('when the parent or child being added is a new_contact', () => {
      it('requires a first name for the new contact', async () => {
        await mountComponent();
        form = formUtils<ParentFormData>(component.find(Form));
        await form.submit();
        expect(
          component
            .text()
            .includes(
              "To create a new contact, you need to provide at least the person's first name",
            ),
        ).toBe(true);
        await form.fill({ firstName: 'Lord' });
        expect(
          component
            .text()
            .includes(
              "To create a new contact, you need to provide at least the person's first name",
            ),
        ).toBe(false);
      });
    });
  });

  describe('submitting the form', () => {
    describe('when the parent being added is a current_contact', () => {
      it('returns a server-side error if the parent or child is not selected', async () => {
        const handleFormErrorsSpy = jest.spyOn(
          formikHelpers,
          'handleFormErrors',
        );
        const noParentChosenMock = {
          input: {
            parentId: '',
            childId: 'ada-lovelace-uuid',
            parentType: null,
            note: null,
          },
          result: {
            errors: [
              { path: '', message: 'Please create or choose a parent to add!' },
            ],
            parentChildRelationship: null,
          },
        };

        const createParentChildRelationship = createParentChildRelationshipMutation(
          noParentChosenMock,
        );

        await mountComponent(
          [createParentChildRelationship, getUserForHomeContainerQuery()],
          currentPersonProps,
        );
        form = formUtils<ParentFormData>(component.find(Form));
        await form.submit();
        await act(async () => {
          await wait(0);
        });
        expect(handleFormErrorsSpy).toHaveBeenCalled();
        expect(
          component.text().includes('Please create or choose a parent to add!'),
        ).toBe(true);
      });

      it('submits the form when a parent is selected', async () => {
        const props = {
          ...defaultProps,
          initialValues: {
            ...blankInitialValues,
            formParentId: 'lord-byron-uuid',
            parentType: 'biological',
            newOrCurrentContact: 'current_person',
          },
        };

        const createParentChildRelationship = createParentChildRelationshipMutation();

        await mountComponent(
          [createParentChildRelationship, getUserForHomeContainerQuery()],
          props,
        );
        form = formUtils<ParentFormData>(component.find(Form));
        await form.submit();
        expect(createParentChildRelationship.newData).toHaveBeenCalled();
      });
    });

    describe('when the parent is a new_contact', () => {
      it('calls up to three mutations and submits the form', async () => {
        const createPersonMock = {
          input: {
            firstName: 'Lady',
            lastName: 'Byron',
            showOnDashboard: false,
          },
          result: {
            errors: null,
            person: {
              id: 'lady-byron-uuid',
              firstName: 'Lady',
              lastName: 'Byron',
              showOnDashboard: false,
            },
          },
        };
        const createAgeMock = {
          input: {
            personId: 'lady-byron-uuid',
            age: 37,
            monthsOld: null,
          },
          result: {
            errors: null,
            person: {
              id: 'lady-byron-uuid',
              age: 37,
              monthsOld: null,
            },
          },
        };
        const createParentChildMock = {
          input: {
            parentId: 'lady-byron-uuid',
            childId: 'ada-lovelace-uuid',
            parentType: 'biological',
            note: null,
          },
          result: {
            errors: null,
            parentChildRelationship: {
              id: 'lady-byron-ada-lovelace-uuid',
              parent: {
                id: 'lady-byron-uuid',
                firstName: 'Lady',
                lastName: 'Byron',
              },
              child: {
                id: 'ada-lovelace-uuid',
                firstName: 'Ada',
                lastName: 'Lovelace',
              },
              notes: null,
              parentType: 'biological',
            },
          },
        };
        const createPerson = createPersonMutation(createPersonMock);
        const createAge = createAgeMutation(createAgeMock);
        const createParentChild = createParentChildRelationshipMutation(
          createParentChildMock,
        );

        await mountComponent(
          [
            createPerson,
            createAge,
            createParentChild,
            getUserForHomeContainerQuery(),
          ],
          defaultProps,
        );
        form = formUtils<ParentFormData>(component.find(Form));

        await form.fill({ firstName: 'Lady', lastName: 'Byron', age: 37 });
        await form.fill({ parentType: 'biological' }, 'select');
        await form.submit();
        await act(async () => {
          await wait(1000);
        });
        expect(createPerson.newData).toHaveBeenCalled();
        expect(createAge.newData).toHaveBeenCalled();
        expect(createParentChild.newData).toHaveBeenCalled();
      });
    });
  });
});
