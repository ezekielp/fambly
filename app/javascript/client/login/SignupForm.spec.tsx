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
          login: createUserResult,
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

      await form.fill({ password: 'J39rjeod1' });
      await form.submit();
      expect(component.text().includes('Password is a required field')).toBe(
        false,
      );
    });

    it.only('requires the user to confirm their password', async () => {
      await mountComponent();
      form = formUtils<SignupFormData>(component.find(Form));
      await form.fill({ password: 'J39rjeod1' });
      await form.submit();

      expect(component.text().includes('Passwords must match')).toBe(true);
      expect(handleSubmit).not.toHaveBeenCalled();

      await form.fill({ confirmedPassword: 'J39rjeod1' });
      await form.submit();
      expect(component.text().includes('Passwords must match')).toBe(false);
    });
  });
});
