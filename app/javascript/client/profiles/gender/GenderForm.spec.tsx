import React from 'react';
import {
  GenderForm,
  GenderFormData,
  GenderFormProps,
  blankInitialValues,
} from './GenderForm';
import { createOrUpdateGenderMutation } from 'client/test/mutations/createOrUpdateGender';
import { FormUtils, formUtils } from 'client/test/utils/formik';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { ReactWrapper, mount } from 'enzyme';
import { Form } from 'formik';
import { act } from 'react-dom/test-utils';
import wait from 'waait';

describe('<GenderForm />', () => {
  let mountComponent: (
    mocks?: MockedResponse[],
    props?: GenderFormProps,
  ) => Promise<void>;
  let component: ReactWrapper<GenderFormProps>;
  let defaultMocks: MockedResponse[];
  let defaultProps: GenderFormProps;
  let customGenderProps: GenderFormProps;
  let form: FormUtils;

  beforeEach(() => {
    defaultMocks = [createOrUpdateGenderMutation()];
    defaultProps = {
      initialValues: blankInitialValues,
      setFieldToAdd: jest.fn(),
      personId: 'katherine-johnson-uuid',
    };
    customGenderProps = {
      ...defaultProps,
      initialValues: {
        ...blankInitialValues,
        gender: 'custom',
      },
    };

    mountComponent = async (mocks = defaultMocks, props = defaultProps) => {
      await act(async () => {
        component = mount(
          <MockedProvider mocks={mocks} addTypename={false}>
            <MemoryRouter
              initialEntries={[
                { pathname: '/profiles/katherine-johnson-uuid' },
              ]}
            >
              <Route
                path="/profiles/katherine-johnson-uuid"
                render={() => <GenderForm {...props} />}
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

  it("has one form field when the gender is 'male', 'female' or 'non-binary'", async () => {
    await mountComponent();
    form = formUtils<GenderFormData>(component.find(Form));

    expect(form.findInputByName('gender', 'select').exists()).toBe(true);
  });

  it("has a second form field when the gender is 'custom'", async () => {
    await mountComponent(defaultMocks, customGenderProps);
    form = formUtils<GenderFormData>(component.find(Form));

    expect(form.findInputByName('customGender').exists()).toBe(true);
  });

  describe('form validations', () => {
    it("requires a custom gender when 'gender' is specified as 'custom'", async () => {
      const androidProps = {
        ...customGenderProps,
        personId: 'brent-spiner-uuid',
      };

      const customGenderMock = {
        input: {
          gender: 'android',
          personId: 'brent-spiner-uuid',
        },
        result: {
          person: {
            id: 'brent-spiner-uuid',
            gender: 'android',
          },
        },
      };

      await mountComponent(
        [createOrUpdateGenderMutation(customGenderMock)],
        androidProps,
      );
      form = formUtils<GenderFormData>(component.find(Form));
      await form.submit();
      expect(
        component
          .text()
          .includes(
            'You must choose a gender to save to this profile, or you can press the cancel button!',
          ),
      ).toBe(true);

      await form.fill({ customGender: 'android' });
      await form.submit();
      expect(
        component
          .text()
          .includes(
            'You must choose a gender to save to this profile, or you can press the cancel button!',
          ),
      ).toBe(false);
    });
  });

  describe('form submission', () => {
    it('submits the form and calls the createOrUpdateGender mutation when the data is valid', async () => {
      const createOrUpdateGender = createOrUpdateGenderMutation();
      await mountComponent([createOrUpdateGender], defaultProps);
      form = formUtils<GenderFormData>(component.find(Form));
      await form.fill({ gender: 'female' }, 'select');
      await form.submit();
      expect(createOrUpdateGender.newData).toHaveBeenCalled();
    });
  });
});
