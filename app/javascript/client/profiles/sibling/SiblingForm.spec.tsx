import React from 'react';
import {
  SiblingForm,
  SiblingFormData,
  SiblingFormProps,
  blankInitialValues,
} from './SiblingForm';
import { FormUtils, formUtils } from 'client/test/utils/formik';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { createSiblingRelationshipMutation } from 'client/test/mutations/createSibling';
import { getUserPeopleQuery } from 'client/test/queries/getUserPeople';
import { ReactWrapper, mount } from 'enzyme';
import { Form } from 'formik';
import { act } from 'react-dom/test-utils';
import wait from 'waait';

describe('<SiblingForm />', () => {
  let mountComponent: (
    mocks?: MockedResponse[],
    props?: SiblingFormProps,
  ) => Promise<void>;
  let component: ReactWrapper<SiblingFormProps>;
  let form: FormUtils;
  let defaultMocks: MockedResponse[];
  let defaultProps: SiblingFormProps;
  let currentPersonProps: SiblingFormProps;

  beforeEach(() => {
    defaultProps = {
      initialValues: blankInitialValues,
      personFirstName: 'Andre',
      setFieldToAdd: jest.fn(),
      siblingOneId: 'andre-weil-uuid',
      relations: [],
    };
    defaultMocks = [createSiblingRelationshipMutation(), getUserPeopleQuery()];
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
              initialEntries={[{ pathname: '/profiles/andre-weil-uuid' }]}
            >
              <Route
                path="/profiles/andre-weil-uuid"
                render={() => <SiblingForm {...props} />}
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

  it('has eight form fields when the sibling to be added is a new_contact', async () => {
    await mountComponent();
    form = formUtils<SiblingFormData>(component.find(Form));

    expect(component.find(Form).exists()).toBe(true);

    expect(form.findInputByName('newOrCurrentContact').exists()).toBe(true);
    expect(form.findInputByName('showOnDashboard').exists()).toBe(true);
    expect(form.findInputByName('firstName').exists()).toBe(true);
    expect(form.findInputByName('lastName').exists()).toBe(true);
    expect(form.findInputByName('siblingType', 'select').exists()).toBe(true);
    expect(form.findInputByName('note', 'textarea').exists()).toBe(true);
  });

  it('has four form fields when the sibling to be added is a current_contact', async () => {
    await mountComponent(defaultMocks, currentPersonProps);
    form = formUtils<SiblingFormData>(component.find(Form));

    expect(form.findInputByName('newOrCurrentContact').exists()).toBe(true);
    expect(component.find("Field[name='formSiblingId']").exists()).toBe(true);
    expect(form.findInputByName('siblingType', 'select').exists()).toBe(true);
    expect(form.findInputByName('note', 'textarea').exists()).toBe(true);
  });

  describe('submitting the form', () => {
    describe('when the sibling being added is a new_contact', () => {
      it('submits the form and calls one mutation to create a new sibling_relationship', async () => {
        const createSiblingRelationship = createSiblingRelationshipMutation();

        await mountComponent(
          [createSiblingRelationship, getUserPeopleQuery()],
          defaultProps,
        );
        form = formUtils<SiblingFormData>(component.find(Form));
        await form.fill({ firstName: 'Simone', lastName: 'Weil' });
        await form.fill({ siblingType: 'biological' }, 'select');
        await form.check(['showOnDashboard']);
        await form.submit();
        await act(async () => {
          await wait(1000);
        });
        expect(createSiblingRelationship.newData).toHaveBeenCalled();
      });
    });

    describe('when the sibling being added is a current_contact', () => {
      it.skip('submits the form when a sibling is selected and calls one mutation to create a new sibling_relationship', async () => {
        const currentPersonMock = {
          input: {
            siblingOneId: 'andrew-weil-uuid',
            siblingTwoId: 'alexander-grothendieck-uuid',
            siblingType: 'step_sibling',
            firstName: null,
            lastName: null,
            showOnDashboard: false,
            note: null,
          },
          result: {
            errors: null,
            siblingRelationship: {
              id: 'weil-step-siblings-uuid',
              siblingOne: {
                id: 'andre-weil-uuid',
                firstName: 'Andre',
                lastName: 'Weil',
              },
              siblingTwo: {
                id: 'alexander-grothendieck-uuid',
                firstName: 'Alexander',
                lastName: 'Grothendieck',
              },
              siblingType: 'step_sibling',
              notes: null,
            },
          },
        };
        const currentPersonProps = {
          ...defaultProps,
          initialValues: {
            ...blankInitialValues,
            newOrCurrentContact: 'current_person',
          },
        };
        const userDataMock = {
          people: [
            {
              id: 'alexander-grothendieck-uuid',
              firstName: 'Alexander',
              lastName: 'Grothendieck',
              showOnDashboard: false,
            },
          ],
        };
        const createSiblingRelationship = createSiblingRelationshipMutation(
          currentPersonMock,
        );

        await mountComponent(
          [createSiblingRelationship, getUserPeopleQuery(userDataMock)],
          currentPersonProps,
        );
        form = formUtils<SiblingFormData>(component.find(Form));
        await form.fill(
          {
            siblingType: 'step_sibling',
            formSiblingId: 'alexander-grothendieck-uuid',
          },
          'select',
        );
        await form.submit();
        await act(async () => {
          await wait(1000);
        });
        expect(createSiblingRelationship.newData).toHaveBeenCalled();
      });
    });
  });
});
