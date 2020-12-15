import React from 'react';
import {
  EmailForm,
  EmailFormData,
  EmailFormProps,
  blankInitialValues,
} from './EmailForm';
import { createEmailMutation } from 'client/test/mutations/createEmail';
import { FormUtils, formUtils } from 'client/test/utils/formik';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { ReactWrapper, mount } from 'enzyme';
import { Form } from 'formik';
import { act } from 'react-dom/test-utils';
import wait from 'waait';

describe('<EmailForm />', () => {
  let mountComponent: (
    mocks?: MockedResponse[],
    props?: EmailFormProps,
  ) => Promise<void>;
  let component: ReactWrapper<EmailFormProps>;
  let defaultMocks: MockedResponse[];
  let defaultProps: EmailFormProps;
  let form: FormUtils;

  beforeEach(() => {
    defaultMocks = [createEmailMutation()];
    defaultProps = {
      initialValues: blankInitialValues,
      setFieldToAdd: jest.fn(),
      personId: 'richard-feynman-uuid',
    };

    mountComponent = async (mocks = defaultMocks, props = defaultProps) => {
      await act(async () => {
        component = mount(
          <MockedProvider mocks={mocks} addTypename={false}>
            <MemoryRouter
              initialEntries={[{ pathname: '/profiles/richard-feynman-uuid' }]}
            >
              <Route
                path="/profiles/richard-feynman-uuid"
                render={() => <EmailForm {...props} />}
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
    form = formUtils<EmailFormData>(component.find(Form));
    expect(form.findInputByName('email').exists()).toBe(true);
    expect(form.findInputByName('emailType', 'select').exists()).toBe(true);
  });

  describe('form validations', () => {
    it('requires a valid email address', async () => {
      await mountComponent();
      form = formUtils<EmailFormData>(component.find(Form));
      await form.submit();
      expect(component.text().includes(''));
    });
  });
});
