import React from 'react';
import { ReactWrapper, mount } from 'enzyme';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import {
  createUserMutation,
  createUserResult,
} from 'client/test/mutations/signup';
import { AuthContext } from 'client/contexts/AuthContext';
import { Form } from 'formik';
import { formUtils, FormUtils } from '../test/utils/formik';
import { SignupForm, SignupFormProps, SignupFormData } from './SignupForm';
import { act } from 'react-dom/test-utils';
import wait from 'waait';

describe('<SignupForm />', () => {
  let mountComponent: (
    mocks?: MockedResponse[],
    onSubmit?: jest.Mock,
  ) => Promise<void>;
  let component: ReactWrapper<SignupFormProps>;
  let form: FormUtils;
  let handleSubmit: jest.Mock;

  beforeEach(() => {
    handleSubmit = jest.fn(() =>
      Promise.resolve({
        data: {
          createUser: createUserResult,
        },
      }),
    );
    const initialValues = { email: '', password: '', confirmedPassword: '' };

    mountComponent = async (
      mocks = [createUserMutation()],
      onSubmit = handleSubmit,
    ) => {
      await act(async () => {
        component = mount(
          <MockedProvider mocks={mocks} addTypename={false}>
            <AuthContext.Provider value={{}}>
              <MemoryRouter initialEntries={[{ pathname: '/signup' }]}>
                <Route path="/signup">
                  <SignupForm
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
      form = formUtils<SignupFormData>(component.find(Form));
      await form.submit();

      expect(component.text().includes('Email is a required field')).toBe(true);
      expect(handleSubmit).not.toHaveBeenCalled();

      await form.fill({ email: 'slothrop@gr.com' });
      await form.submit();
      expect(component.text().includes('Email is a required field')).toBe(
        false,
      );
    });

    it('requires password', async () => {
      await mountComponent();
      form = formUtils<SignupFormData>(component.find(Form));
      await form.submit();

      expect(component.text().includes('Password is a required field')).toBe(
        true,
      );
      expect(handleSubmit).not.toHaveBeenCalled();

      await form.fill({
        password: 'J39rjeod1',
        confirmedPassword: 'J39rjeod1',
      });
      await form.submit();
      expect(component.text().includes('Password is a required field')).toBe(
        false,
      );
    });

    it('requires the user to confirm their password', async () => {
      await mountComponent();
      form = formUtils<SignupFormData>(component.find(Form));
      await form.fill({ password: 'J39rjeod1', confirmedPassword: '12345' });
      await form.submit();

      expect(component.text().includes('Passwords must match')).toBe(true);
      expect(handleSubmit).not.toHaveBeenCalled();

      await form.fill({ confirmedPassword: 'J39rjeod1' });
      await form.submit();
      expect(component.text().includes('Passwords must match')).toBe(false);
    });
  });

  describe('submitting the form', () => {
    it('renders server-side errors if they are returned', async () => {
      const errors = [
        { path: 'email', message: 'This email address is already registered!' },
      ];
      const handleSubmit = jest.fn(() =>
        Promise.resolve({
          data: {
            createUser: {
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

      await mountComponent([createUserMutation(mock)], handleSubmit);
      form = formUtils<SignupFormData>(component.find(Form));

      await form.fill({
        email: 'slothrop@gr.com',
        password: 'correct-password',
        confirmedPassword: 'correct-password',
      });
      await form.submit();
      expect(
        component.text().includes('This email address is already registered!'),
      ).toBe(true);
    });

    it('submits the form if there are no errors', async () => {
      const createUser = createUserMutation();
      handleSubmit = jest.fn(() => Promise.resolve(createUser));

      await mountComponent([createUser], handleSubmit);
      form = formUtils<SignupFormData>(component.find(Form));

      await form.fill({
        email: 'slothrop@gr.com',
        password: 'Schwarzgerat',
        confirmedPassword: 'Schwarzgerat',
      });
      await form.submit();
      await act(async () => {
        await wait(2000);
      });

      expect(handleSubmit).toHaveBeenCalled();
    });
  });
});
