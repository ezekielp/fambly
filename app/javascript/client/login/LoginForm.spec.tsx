import React from 'react';
import { ReactWrapper, mount } from 'enzyme';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { loginMutation, loginResult } from 'client/test/mutations/login';
import { AuthContext } from 'client/contexts/AuthContext';
import { Form } from 'formik';
import { History } from 'history';
import { LoginForm, LoginFormProps, LoginFormData } from './LoginForm';
import { formUtils, FormUtils } from '../test/utils/formik';
import { act } from 'react-dom/test-utils';
import wait from 'waait';

describe('<LoginForm />', () => {
  let mountComponent: (
    mocks?: MockedResponse[],
    onSubmit?: jest.Mock,
  ) => Promise<void>;
  let component: ReactWrapper<LoginFormProps>;
  let form: FormUtils;
  let handleSubmit: jest.Mock;
  let history: History;

  beforeEach(() => {
    handleSubmit = jest.fn(() =>
      Promise.resolve({
        data: {
          login: loginResult,
        },
      }),
    );
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
                <Route
                  path="/login"
                  render={(routerProps) => {
                    history = routerProps.history;
                    return (
                      <LoginForm
                        onSubmit={onSubmit}
                        initialValues={initialValues}
                      />
                    );
                  }}
                ></Route>
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
      form = formUtils<LoginFormData>(component.find(Form));
      await form.submit();

      expect(
        component
          .text()
          .includes(
            'Please enter the email address associated with your Fambly account',
          ),
      ).toBe(true);
      expect(handleSubmit).not.toHaveBeenCalled();

      await form.fill({ email: 'slothrop@gr.com' });
      await form.submit();
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
      form = formUtils<LoginFormData>(component.find(Form));
      await form.submit();

      expect(
        component
          .text()
          .includes(
            'Please enter the password associated with your Fambly account',
          ),
      ).toBe(true);
      expect(handleSubmit).not.toHaveBeenCalled();

      await form.fill({ password: 'J39rjeod1' });
      await form.submit();
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
    it('renders server-side errors if they are returned', async () => {
      const errors = [{ path: '', message: 'Big scary global error!' }];
      const handleSubmit = jest.fn(() =>
        Promise.resolve({
          data: {
            login: {
              errors,
            },
          },
        }),
      );
      const mock = {
        result: {
          errors,
        },
      };

      await mountComponent([loginMutation(mock)], handleSubmit);
      form = formUtils<LoginFormData>(component.find(Form));

      await form.fill({
        email: 'slothrop@gr.com',
        password: 'incorrect-password',
      });
      await form.submit();
      expect(component.text().includes('Big scary global error!')).toBe(true);
    });

    it('submits the form if there are no errors', async () => {
      const login = loginMutation();
      handleSubmit = jest.fn(() => Promise.resolve(login));

      await mountComponent([login], handleSubmit);
      form = formUtils<LoginFormData>(component.find(Form));

      await form.fill({
        email: 'slothrop@gr.com',
        password: 'Schwarzgerat',
      });
      await form.submit();
      // await act(async () => {
      //   await wait(0);
      // });

      expect(handleSubmit).toHaveBeenCalled();
    });
  });
});
