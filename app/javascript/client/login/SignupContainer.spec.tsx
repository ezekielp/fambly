import { Route, MemoryRouter } from 'react-router-dom';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { ReactWrapper, mount } from 'enzyme';
import { AuthContext } from 'client/contexts/AuthContext';
import { createUserMutation } from 'client/test/mutations/signup';
import React from 'react';
import wait from 'waait';
import { act } from 'react-dom/test-utils';
import { SignupContainer } from './SignupContainer';
import { SignupForm } from './SignupForm';

describe('<SignupContainer />', () => {
  let mountComponent: (mocks?: MockedResponse[]) => Promise<void>;
  let component: ReactWrapper;

  beforeEach(() => {
    mountComponent = async (mocks = [createUserMutation()]) => {
      await act(async () => {
        component = mount(
          <MockedProvider mocks={mocks} addTypename={false}>
            <AuthContext.Provider value={{}}>
              <MemoryRouter initialEntries={['/signup']}>
                <Route path="/signup">
                  <SignupContainer />
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
    expect(component.find(SignupContainer).exists()).toBe(true);
  });

  it('renders a <SignupForm />', async () => {
    await mountComponent();
    expect(component.find(SignupForm).exists()).toBe(true);
  });
});
