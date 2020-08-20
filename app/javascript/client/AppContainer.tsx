import React, { FC, useContext } from "react";
import { Redirect, Route, Switch } from "react-router";
import { AuthContext } from "client/contexts/AuthContext";

export const AppContainer: FC<{}> = () => {
  const { userId } = useContext(AuthContext);
  const loggedIn = !!userId;

  return (
    <>
      <Switch>
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </>
  );
};
