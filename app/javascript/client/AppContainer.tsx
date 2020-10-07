import React, { FC, useContext } from 'react';
import {
  Redirect,
  Route,
  Switch,
  withRouter,
  RouteProps,
} from 'react-router-dom';
import { useLogoutMutation } from 'client/graphqlTypes';
import { AuthContext } from 'client/contexts/AuthContext';
import { SignupContainer } from './login/SignupContainer';
import { LoginContainer } from './login/LoginContainer';
import { HomeContainer } from './home/HomeContainer';
import { LandingPage } from './home/LandingPage';
import { PersonContainer } from './profiles/PersonContainer';
import { Wrapper } from 'client/common/Wrapper';
import { NavBar } from 'client/nav/NavBar';
import { Footer } from 'client/nav/Footer';

interface ProtectedRouteProps extends RouteProps {
  accessAllowed: boolean;
  redirect?: string;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({
  accessAllowed,
  redirect = '/landing',
  ...rest
}) => {
  if (accessAllowed) {
    return <Route {...rest} />;
  }

  return <Redirect to={redirect} />;
};

interface AppContainerProps {}

const InternalAppContainer: FC<AppContainerProps> = () => {
  const { userId, dummyEmailFlag } = useContext(AuthContext);
  const loggedIn = !!userId;
  const [logoutMutation] = useLogoutMutation();

  const handleLogout = async () => {
    await logoutMutation();
    window.location.href = '/landing';
  };

  const navMenuItems = [];
  const logoutItem = { label: 'Log out', onClick: handleLogout };
  const signupItem = { label: 'Sign up', href: '/signup' };
  const loginItem = { label: 'Log in', href: '/login' };

  if (loggedIn && !dummyEmailFlag) {
    navMenuItems.push(logoutItem);
  } else {
    navMenuItems.push(signupItem);
    navMenuItems.push(loginItem);
  }

  return (
    <Wrapper>
      <NavBar dropdownItems={navMenuItems} />
      <Switch>
        <Route path="/signup" component={SignupContainer}></Route>
        <Route path="/login">
          <LoginContainer />
        </Route>
        <Route path="/landing">
          <LandingPage />
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
          <Redirect to="/landing" />
        </Route>
      </Switch>
      <Footer />
    </Wrapper>
  );
};

export const AppContainer = withRouter(InternalAppContainer);
