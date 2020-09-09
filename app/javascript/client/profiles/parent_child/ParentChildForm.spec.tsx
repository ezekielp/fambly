import React from 'react';
import {
  ParentChildForm,
  ParentChildFormData,
  ParentChildFormProps,
  blankInitialValues,
} from './ParentChildForm';
import { FormUtils, formUtils } from 'client/test/utils/formik';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { createParentChildRelationshipMutation } from 'client/test/mutations/createParentChild';
import { getUserForHomeContainerQuery } from 'client/test/queries/getUserForHomeContainer';
import { createAgeMutation } from 'client/test/mutations/createAge';
import { ReactWrapper, mount } from 'enzyme';
import { Form } from 'formik';
import { act } from 'react-dom/test-utils';
import wait from 'waait';
// import * as formikHelpers from 'client/utils/formik';

describe('<ParentChildForm />', () => {
  let mountComponent: (
    mocks?: MockedResponse[],
    props?: ParentChildFormProps,
  ) => Promise<void>;
  let component: ReactWrapper<ParentChildFormProps>;
  let form: FormUtils;
  let defaultMocks: MockedResponse[];
  let defaultProps: ParentChildFormProps;
  let currentPersonProps: ParentChildFormProps;

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
                render={() => <ParentChildForm {...props} />}
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

  it('has eight form fields when the parent or child to be added is a new_contact', async () => {
    await mountComponent();
    form = formUtils<ParentChildFormData>(component.find(Form));

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

  it('has four form fields when the parent or child to be added is a current_contact', async () => {
    await mountComponent(defaultMocks, currentPersonProps);
    form = formUtils<ParentChildFormData>(component.find(Form));

    expect(form.findInputByName('newOrCurrentContact').exists()).toBe(true);
    expect(form.findInputByName('formParentId', 'select').exists()).toBe(true);
    expect(form.findInputByName('parentType', 'select').exists()).toBe(true);
    expect(form.findInputByName('note', 'textarea').exists()).toBe(true);
  });

  describe('form validations', () => {
    describe('when the parent or child being added is a new_contact', () => {
      it('requires a first name for the new contact', async () => {
        await mountComponent();
        form = formUtils<ParentChildFormData>(component.find(Form));
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

    describe('when the parent or child being added is a current_contact', () => {
      it.only('returns a server-side error if the parent or child is not selected', async () => {
        // const handleFormErrorsSpy = jest.spyOn(
        //   formikHelpers,
        //   'handleFormErrors',
        // );
        const noParentChosenMock = {
          input: {
            parentId: '',
            childId: 'ada-lovelace-uuid',
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
        form = formUtils<ParentChildFormData>(component.find(Form));
        await form.submit();
        await act(async () => {
          await wait(0);
        });
        expect(createParentChildRelationship.newData).toHaveBeenCalled();
        // console.log(component.debug());
        // expect(handleFormErrorsSpy).toHaveBeenCalled();
        expect(
          component.text().includes('Please create or choose a parent to add!'),
        ).toBe(true);
      });

      it.only('submits the form when a parent is selected', async () => {
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
        form = formUtils<ParentChildFormData>(component.find(Form));
        await form.submit();
        await act(async () => {
          await wait(2000);
        });
        // console.log(component.debug());
        expect(createParentChildRelationship.newData).toHaveBeenCalled();
      });
    });
  });
});
