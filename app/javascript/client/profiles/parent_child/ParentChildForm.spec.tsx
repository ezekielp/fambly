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
import {
  createParentChildRelationshipMutation,
  createParentChildRelationshipResult,
} from 'client/test/mutations/createParentChild';
import { getUserForHomeContainerQuery } from 'client/test/queries/getUserForHomeContainer';
import { ReactWrapper, mount } from 'enzyme';
import { Form } from 'formik';
import { act } from 'react-dom/test-utils';
import wait from 'waait';

describe('<ParentChildForm />', () => {
  let mountComponent: (
    mocks?: MockedResponse[],
    props?: ParentChildFormProps,
  ) => Promise<void>;
  let component: ReactWrapper<ParentChildFormProps>;
  let createParentChildProps: ParentChildFormProps;
  let form: FormUtils;

  beforeEach(() => {
    createParentChildProps = {
      initialValues: blankInitialValues,
      personFirstName: 'Ada',
      setFieldToAdd: jest.fn(),
      childId: 'ada-lovelace-uuid',
    };

    mountComponent = async (
      mocks = [
        createParentChildRelationshipMutation(),
        getUserForHomeContainerQuery(),
      ],
      props = createParentChildProps,
    ) => {
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
    expect(form.findSelectByName('parentType').exists()).toBe(true);
    expect(form.findTextareaByName('note').exists()).toBe(true);
  });

  it('has four form fields when the parent or child to be added is a current_contact', async () => {
    const props = {
      initialValues: {
        ...blankInitialValues,
        newOrCurrentContact: 'current_person',
      },
      personFirstName: 'Ada',
      setFieldToAdd: jest.fn(),
      childId: 'ada-lovelace-uuid',
    };

    await mountComponent(
      [createParentChildRelationshipMutation(), getUserForHomeContainerQuery()],
      props,
    );
    form = formUtils<ParentChildFormData>(component.find(Form));

    expect(form.findInputByName('newOrCurrentContact').exists()).toBe(true);
    expect(form.findSelectByName('formParentId').exists()).toBe(true);
    expect(form.findSelectByName('parentType').exists()).toBe(true);
    expect(form.findTextareaByName('note').exists()).toBe(true);
  });

  describe('form validations', () => {
    describe('when the parent or child being added is a new_contact', () => {
      it('requires a first name for the new contact', async () => {});
    });
    describe('when the parent or child being added is a current_contact', () => {
      it('returns a server-side error if the parent or child is not selected', async () => {});
    });
  });
});
