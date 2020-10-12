import React from 'react';
import { PersonForm, PersonFormData, PersonFormProps } from './PersonForm';
import { FormUtils, formUtils } from 'client/test/utils/formik';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import {
  createPersonMutation,
  createPersonResult,
} from 'client/test/mutations/addPerson';
import { ReactWrapper, mount } from 'enzyme';
import { Form } from 'formik';
import { History } from 'history';
import { RouteComponentProps } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import wait from 'waait';

describe('<AddPersonForm />', () => {
  let mountComponent: (mocks?: MockedResponse[]) => Promise<void>;
  let component: ReactWrapper<PersonFormProps & RouteComponentProps>;
  let form: FormUtils;
  let history: History;

  beforeEach(() => {
    const refetchUserData = jest.fn();

    mountComponent = async (mocks = [createPersonMutation()]) => {
      await act(async () => {
        component = mount(
          <MockedProvider mocks={mocks} addTypename={false}>
            <MemoryRouter initialEntries={[{ pathname: '/home' }]}>
              <Route
                path="/home"
                render={(routerProps) => {
                  history = routerProps.history;
                  return (
                    <PersonForm
                      refetchUserData={refetchUserData}
                      {...routerProps}
                    />
                  );
                }}
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
    await mountComponent();
    expect(component.exists()).toBe(true);
  });

  it('has two form fields', async () => {
    await mountComponent();
    form = formUtils<PersonFormData>(component.find(Form));

    expect(component.find(Form).exists()).toBe(true);
    expect(form.findInputByName('firstName').exists()).toBe(true);
    expect(form.findInputByName('lastName').exists()).toBe(true);
  });

  describe('form validations', () => {
    it('requires a first name', async () => {
      await mountComponent();
      form = formUtils<PersonFormData>(component.find(Form));

      await form.submit();
      expect(
        component
          .text()
          .includes(
            'Please provide at least a first name when adding a new person',
          ),
      ).toBe(true);
      await form.fill({ firstName: 'Roger', lastName: 'Mexico' });
      await form.submit();
      expect(
        component
          .text()
          .includes(
            'Please provide at least a first name when adding a new person',
          ),
      ).toBe(false);
    });
  });

  describe('submitting the form', () => {
    it('uses a mutation to create a new person if there are no server-side errors', async () => {
      const createPerson = createPersonMutation();

      await mountComponent([createPerson]);
      form = formUtils<PersonFormData>(component.find(Form));

      await form.fill({ firstName: 'Roger', lastName: 'Mexico' });
      await form.submit();
      expect(createPerson.newData).toHaveBeenCalled();
    });

    it('redirects to the new person page if the form submission is successful', async () => {
      await mountComponent();
      form = formUtils<PersonFormData>(component.find(Form));
      await form.fill({ firstName: 'Roger', lastName: 'Mexico' });
      await form.submit();

      await act(async () => await wait(0));
      expect(history.location.pathname).toEqual(
        `/profiles/${createPersonResult.person?.id}`,
      );
    });
  });
});
