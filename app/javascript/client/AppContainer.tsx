import React, { FC, useContext } from 'react';
import {
  Link,
  Redirect,
  Route,
  Switch,
  withRouter,
  RouteProps,
} from 'react-router-dom';
import { AuthContext } from 'client/contexts/AuthContext';
import { SignupContainer } from './login/SignupContainer';
import { LoginContainer } from './login/LoginContainer';
import { HomeContainer } from './home/HomeContainer';
import { PersonContainer } from './profiles/PersonContainer';

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
      <Link to="/home">fambly</Link>
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
        <ProtectedRoute
          path="/profiles/:personId"
          accessAllowed={loggedIn}
          component={PersonContainer}
        />
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </>
  );
};

export const AppContainer = withRouter(InternalAppContainer);
