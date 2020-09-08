import React from 'react';
import {
  BirthdateForm,
  BirthdateFormData,
  BirthdateFormProps,
  blankInitialValues,
} from './BirthdateForm';
import { createOrUpdateBirthdateMutation } from 'client/test/mutations/createOrUpdateBirthdate';
import { FormUtils, formUtils } from 'client/test/utils/formik';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { ReactWrapper, mount } from 'enzyme';
import { Form } from 'formik';
import { act } from 'react-dom/test-utils';
import wait from 'waait';

describe('<BirthdateForm />', () => {
  let mountComponent: (
    mocks?: MockedResponse[],
    props?: BirthdateFormProps,
  ) => Promise<void>;
  let component: ReactWrapper<BirthdateFormProps>;
  let defaultMocks: MockedResponse[];
  let defaultProps: BirthdateFormProps;
  let form: FormUtils;

  beforeEach(() => {
    defaultMocks = [createOrUpdateBirthdateMutation()];
    defaultProps = {
      initialValues: blankInitialValues,
      setFieldToAdd: jest.fn(),
      personId: 'david-blackwell-uuid',
    };

    mountComponent = async (mocks = defaultMocks, props = defaultProps) => {
      await act(async () => {
        component = mount(
          <MockedProvider mocks={mocks} addTypename={false}>
            <MemoryRouter
              initialEntries={[{ pathname: '/profiles/david-blackwell-uuid' }]}
            >
              <Route
                path="/profiles/david-blackwell-uuid"
                render={() => <BirthdateForm {...props} />}
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

  it('has at least three form fields, for birthYear, birthMonth and birthDay', async () => {
    await mountComponent();
    expect(component.find(Form).exists()).toBe(true);

    form = formUtils<BirthdateFormData>(component.find(Form));
    expect(form.findInputByName('birthYear').exists()).toBe(true);
    expect(form.findSelectByName('birthMonth').exists()).toBe(true);
    expect(form.findSelectByName('birthDay').exists()).toBe(true);
  });

  describe('form validations', () => {
    it('requires a birthMonth when birthDay is specified', async () => {
      await mountComponent();
      form = formUtils<BirthdateFormData>(component.find(Form));
      await form.select({ birthDay: '24' });
      await form.submit();
      expect(
        component.text().includes('Month is required if you specify a day'),
      ).toBe(true);

      await form.select({ birthMonth: '4' });
      await form.fill({ birthYear: 1919 });
      await form.submit();
      expect(
        component.text().includes('Month is required if you specify a day'),
      ).toBe(false);
    });

    it('requires the birthYear to be in the past (more or less)', async () => {
      await mountComponent();
      form = formUtils<BirthdateFormData>(component.find(Form));
      const today = new Date();
      await form.fill({ birthYear: 3017 });
      await form.submit();
      expect(
        component
          .text()
          .includes(
            `birthYear must be less than or equal to ${today.getFullYear()}`,
          ),
      ).toBe(true);

      await form.select({ birthMonth: '4', birthDay: '24' });
      await form.fill({ birthYear: 1919 });
      await form.submit();
      expect(
        component
          .text()
          .includes(
            `birthYear must be less than or equal to ${today.getFullYear()}`,
          ),
      ).toBe(false);
    });
  });

  describe('form submission', () => {
    it('submits the form and calls the createOrUpdateBirthdate mutation when the data is valid', async () => {
      const createOrUpdateBirthdate = createOrUpdateBirthdateMutation();

      await mountComponent([createOrUpdateBirthdate], defaultProps);
      form = formUtils<BirthdateFormData>(component.find(Form));
      await form.select({ birthMonth: '4', birthDay: '24' });
      await form.fill({ birthYear: 1919 });
      await form.submit();
      expect(createOrUpdateBirthdate.newData).toHaveBeenCalled();
    });
  });
});
