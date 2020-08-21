import React from 'react';
import { ReactWrapper, mount } from 'enzyme';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { loginMutation, loginResult } from 'client/test/mutations/login';
import { AuthContext } from 'client/contexts/AuthContext';
import { Form } from 'formik';
import { LoginForm, LoginFormData, LoginFormProps } from './LoginForm';
import { act } from 'react-dom/test-utils';
import wait from 'waait';

describe('<LoginForm />', () => {
  let mountComponent: (
    mocks?: MockedResponse[],
    onSubmit?: jest.Mock,
  ) => Promise<void>;
  let component: ReactWrapper<LoginFormProps>;
  let handleSubmit: jest.Mock;
  // let props: LoginFormProps;

  beforeEach(() => {
    handleSubmit = jest.fn(() =>
      Promise.resolve({
        data: {
          login: loginResult,
        },
      }),
    );
    // props = {
    //   onSubmit,
    // initialValues: { email: '', password: '' },
    // };
    const initialValues = { email: '', password: '' };

    mountComponent = async (
      mocks = [loginMutation()],
      onSubmit = handleSubmit,
    ) => {
      await act(async () => {
        component = mount(
          <MockedProvider mocks={mocks} addTypename={false}>
            <AuthContext.Provider value={{}}>
              <MemoryRouter initialEntries={[{ pathname: '/login' }]}>
                <Route path="/login">
                  {/* <LoginForm {...props} /> */}
                  <LoginForm
                    onSubmit={onSubmit}
                    initialValues={initialValues}
                  />
                </Route>
              </MemoryRouter>
            </AuthContext.Provider>
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

  describe('form validations', () => {
    it('requires email', async () => {
      await mountComponent();
      await component.find(Form).simulate('submit');
      await act(async () => await wait(0));
      expect(
        component
          .text()
          .includes(
            'Please enter the email address associated with your Fambly account',
          ),
      ).toBe(true);
      expect(handleSubmit).not.toHaveBeenCalled();

      component.find('input[name="email"]').simulate('change', {
        target: { name: 'email', value: 'slothrop@gr.com' },
      });
      await act(async () => await wait(0));
      await component.find(Form).simulate('submit');
      await act(async () => await wait(0));
      expect(
        component
          .text()
          .includes(
            'Please enter the email address associated with your Fambly account',
          ),
      ).toBe(false);
    });

    it('requires password', async () => {
      await mountComponent();
      await component.find(Form).simulate('submit');
      await act(async () => await wait(0));
      expect(
        component
          .text()
          .includes(
            'Please enter the password associated with your Fambly account',
          ),
      ).toBe(true);
      expect(handleSubmit).not.toHaveBeenCalled();

      component.find('input[name="password"]').simulate('change', {
        target: { name: 'password', value: 'correct-password' },
      });
      await act(async () => await wait(0));
      await component.find(Form).simulate('submit');
      await act(async () => await wait(0));
      expect(
        component
          .text()
          .includes(
            'Please enter the password associated with your Fambly account',
          ),
      ).toBe(false);
    });
  });

  describe('submitting the form', () => {
    it.skip('renders server-side errors if they are returned', async () => {
      const errors = [{ path: '', message: 'Big scary global error!' }];
      const handleSubmit = jest.fn(() =>
        Promise.resolve({
          data: {
            errors,
          },
        }),
      );
      const mock = {
        result: {
          errors,
        },
      };

      await mountComponent([loginMutation(mock)], handleSubmit);
      component.find('input[name="email"]').simulate('change', {
        target: { name: 'email', value: 'correct-email' },
      });
      await act(async () => await wait(0));
      await mountComponent([loginMutation(mock)], handleSubmit);
      component.find('input[name="password"]').simulate('change', {
        target: { name: 'password', value: 'correct-password' },
      });
      await act(async () => await wait(0));
      await component.find(Form).simulate('submit');
      await act(async () => await wait(0));
      console.log(component.debug());
      expect(component.text().includes('Big scary global error!')).toBe(true);
    });
  });
});
