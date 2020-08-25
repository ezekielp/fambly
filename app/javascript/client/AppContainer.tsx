import React, { FC, useContext } from 'react';
import { Redirect, Route, Switch, withRouter, RouteProps } from 'react-router';
import { AuthContext } from 'client/contexts/AuthContext';
import { SignupContainer } from './login/SignupContainer';
import { LoginContainer } from './login/LoginContainer';
import { HomeContainer } from './home/HomeContainer';

interface ProtectedRouteProps extends RouteProps {
  accessAllowed: boolean;
  redirect?: string;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({
  accessAllowed,
  redirect = '/login',
  ...rest
}) => {
  if (accessAllowed) {
    return <Route {...rest} />;
  }

  return <Redirect to={redirect} />;
};

interface AppContainerProps {}

const InternalAppContainer: FC<AppContainerProps> = () => {
  const { userId } = useContext(AuthContext);
  const loggedIn = !!userId;

  return (
    <>
      <Switch>
        <Route path="/signup">
          <SignupContainer />
        </Route>
        <Route path="/login">
          <LoginContainer />
        </Route>
        <ProtectedRoute
          path="/home"
          accessAllowed={loggedIn}
          component={HomeContainer}
        />
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </>
  );
};

export const AppContainer = withRouter(InternalAppContainer);
