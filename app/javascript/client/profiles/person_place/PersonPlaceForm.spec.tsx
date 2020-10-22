import React from 'react';
import {
  PersonPlaceForm,
  PersonPlaceFormData,
  PersonPlaceFormProps,
  blankInitialValues,
} from './PersonPlaceForm';
import { createPersonPlaceMutation } from 'client/test/mutations/createPersonPlace';
import { FormUtils, formUtils } from 'client/test/utils/formik';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { ReactWrapper, mount } from 'enzyme';
import { Form } from 'formik';
import { act } from 'react-dom/test-utils';
import wait from 'waait';

describe('<PersonPlaceForm />', () => {
  let mountComponent: (
    mocks?: MockedResponse[],
    props?: PersonPlaceFormProps,
  ) => Promise<void>;
  let component: ReactWrapper<PersonPlaceFormProps>;
  let defaultMocks: MockedResponse[];
  let defaultProps: PersonPlaceFormProps;
  let form: FormUtils;

  beforeEach(() => {
    defaultMocks = [createPersonPlaceMutation()];
    defaultProps = {
      initialValues: blankInitialValues,
      setFieldToAdd: jest.fn(),
      personId: 'evelyn-boyd-granville-uuid',
    };

    mountComponent = async (mocks = defaultMocks, props = defaultProps) => {
      await act(async () => {
        component = mount(
          <MockedProvider mocks={mocks} addTypename={false}>
            <MemoryRouter
              initialEntries={[
                { pathname: '/profiles/evelyn-boyd-granville-uuid' },
              ]}
            >
              <Route
                path="/profiles/evelyn-boyd-granville-uuid"
                render={() => <PersonPlaceForm {...props} />}
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

  it('has 10 form fields', async () => {
    await mountComponent();
    form = formUtils<PersonPlaceFormData>(component.find(Form));

    expect(form.findInputByName('country').exists()).toBe(true);
    expect(form.findInputByName('stateOrRegion', 'select').exists()).toBe(true);
    expect(form.findInputByName('town').exists()).toBe(true);
    expect(form.findInputByName('street').exists()).toBe(true);
    expect(form.findInputByName('zipCode').exists()).toBe(true);
    // expect(form.findInputByName('birthPlace').exists()).toBe(true);
    expect(form.findInputByName('startYear').exists()).toBe(true);
    expect(form.findInputByName('startMonth', 'select').exists()).toBe(true);
    expect(form.findInputByName('endYear').exists()).toBe(true);
    expect(form.findInputByName('endMonth', 'select').exists()).toBe(true);
    expect(form.findInputByName('note', 'textarea').exists()).toBe(true);
  });

  describe('form validations', () => {
    it('requires a country', async () => {
      await mountComponent();
      form = formUtils<PersonPlaceFormData>(component.find(Form));
      await form.fill({
        country: '',
      });
      await form.submit();
      expect(
        component.text().includes('You must provide at least a country!'),
      ).toBe(true);

      await form.fill({
        country: 'USA',
      });
      expect(
        component.text().includes('You must provide at least a country!'),
      ).toBe(false);
    });

    it('requires a startYear when startMonth is specified', async () => {
      await mountComponent();
      form = formUtils<PersonPlaceFormData>(component.find(Form));
      await form.fill(
        {
          startMonth: '5',
        },
        'select',
      );
      await form.submit();
      expect(
        component.text().includes('Year is required if you specify a month'),
      ).toBe(true);

      await form.fill({
        startYear: 1924,
      });
      expect(
        component.text().includes('Year is required if you specify a month'),
      ).toBe(false);
    });

    it('requires an endYear when endMonth is specified', async () => {
      await mountComponent();
      form = formUtils<PersonPlaceFormData>(component.find(Form));
      await form.fill(
        {
          endMonth: '8',
        },
        'select',
      );
      await form.submit();
      expect(
        component.text().includes('Year is required if you specify a month'),
      ).toBe(true);

      await form.fill({
        endYear: 1941,
      });
      expect(
        component.text().includes('Year is required if you specify a month'),
      ).toBe(false);
    });
  });

  describe('form submission', () => {
    it.skip('submits the form and calls the createPersonPlace mutation when the data is valid', async () => {
      const createPersonPlace = createPersonPlaceMutation();
      await mountComponent([createPersonPlace], defaultProps);
      form = formUtils<PersonPlaceFormData>(component.find(Form));
      await form.fill(
        {
          stateOrRegion: 'DC',
          startMonth: '5',
        },
        'select',
      );
      await form.fill({
        town: 'Washington',
        startYear: 1924,
      });
      // await form.check(['birthPlace']);

      await form.submit();
      expect(createPersonPlace.newData).toHaveBeenCalled();
    });
  });
});
