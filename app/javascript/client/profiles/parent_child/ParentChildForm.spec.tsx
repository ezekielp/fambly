import React from 'react';
import {
  ParentChildForm,
  ParentChildFormData,
  ParentChildFormProps,
  blankInitialValues,
} from './ParentChildForm';
import { FormUtils, formUtils } from 'client/test/utils/formik';
import { MemoryRouter, Route } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import {
  createParentChildRelationshipMutation,
  createParentChildRelationshipResult,
} from 'client/test/mutations/createParentChild';
import { ReactWrapper, mount } from 'enzyme';
import { Form } from 'formik';
import { act } from 'react-dom/test-utils';
import wait from 'waait';

describe('<ParentChildForm />', () => {
  let mountComponent: (mocks?: MockedResponse[]) => Promise<void>;
  let component: ReactWrapper<ParentChildFormProps>;
  let createParentChildProps: ParentChildFormProps;
  let form: FormUtils;

  beforeEach(() => {
    createParentChildProps = {
      initialValues: blankInitialValues,
      personFirstName: 'Ada',
      setFieldToAdd: jest.fn(),
      childId: 'ada-lovelace-uuid',
    };

    mountComponent = async (
      mocks = [createParentChildRelationshipMutation()],
      props = createParentChildProps,
    ) => {
      await act(async () => {
        component = mount(
          <MockedProvider mocks={mocks} addTypename={false}>
            <MemoryRouter
              initialEntries={[{ pathname: '/profiles/ada-lovelace-uuid' }]}
            >
              <Route
                path="/profiles/ada-lovelace-uuid"
                render={() => <ParentChildForm {...props} />}
              />
              ;
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
});
