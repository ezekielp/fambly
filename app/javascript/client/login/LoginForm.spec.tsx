import React from 'react';
import { ReactWrapper, mount } from 'enzyme';
import { Form } from 'formik';
import { LoginForm, LoginFormData, LoginFormProps } from './LoginForm';
import { act } from 'react-dom/test-utils';
import wait from 'waait';

describe('<LoginForm />', () => {
  let component: ReactWrapper<LoginFormProps>;
  let onSubmit: jest.Mock;
  let props: LoginFormProps;

  beforeEach(() => {
    onSubmit = jest.fn(() =>
      Promise.resolve({
        data: {
          login: {
            errors: null,
            user: { id: 'some-user-id', email: 'slothrop@gr.com' },
          },
        },
      }),
    );
    props = {
      onSubmit,
      initialValues: { email: '', password: '' },
    };
    component = mount(<LoginForm {...props} />);
  });

  it('exists', () => {
    expect(component.exists()).toBe(true);
  });

  it.only('requires email', async () => {
    await component.find(Form).simulate('submit');
    await act(async () => await wait(0));
    expect(
      component
        .text()
        .includes(
          'Please enter the email address associated with your Fambly account',
        ),
    ).toBe(true);
    expect(onSubmit).not.toHaveBeenCalled();

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
});
