import React, { FC } from 'react';
import { Redirect, Route, Switch } from 'react-router';

export const AppContainer: FC<{}> = () => {

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
