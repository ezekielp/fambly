import React, { FC, useContext } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router';
import { AuthContext } from 'client/contexts/AuthContext';
import { LoginContainer } from './login/LoginContainer';

const InternalAppContainer: FC<{}> = () => {
  const { userId } = useContext(AuthContext);
  const loggedIn = !!userId;

  return (
    <>
      <Switch>
        <Route path="/login">
          <LoginContainer />
        </Route>
        <Route path="/random">
          <div>Hello!</div>
        </Route>
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </>
  );
};

export const AppContainer = withRouter(InternalAppContainer);
