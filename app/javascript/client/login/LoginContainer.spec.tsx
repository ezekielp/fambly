import { Route, MemoryRouter } from "react-router-dom";
import { MockedProvider, MockedResponse } from "@apollo/react-testing";
import { ReactWrapper, mount } from "enzyme";
import { loginMutation } from "client/test/mutations/login";
import { AuthContext } from "client/contexts/AuthContext";
import React from "react";
import { act } from "react-dom/test-utils";
import wait from "waait";
import { LoginContainer } from "./LoginContainer";

describe("<LoginContainer />", () => {
  let mountComponent: (mocks?: MockedResponse[]) => Promise<void>;
  let component: ReactWrapper;

  beforeEach(() => {
    mountComponent = async (mocks = [loginMutation()]) => {
      await act(async () => {
        component = mount(
          <MockedProvider mocks={mocks} addTypename={false}>
            <AuthContext.Provider value={{}}>
              <MemoryRouter initialEntries={["/login"]}>
                <Route path="/login">
                  <LoginContainer />
                </Route>
              </MemoryRouter>
            </AuthContext.Provider>
          </MockedProvider>
        );
      });
    };
  });
});
