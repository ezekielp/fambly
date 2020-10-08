import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider } from '@apollo/client';
import { AuthContextProvider } from 'client/contexts/AuthContext';
import { PeopleContextProvider } from 'client/contexts/PeopleContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppContainer } from '../client/AppContainer';
import { client } from './client';

const RootApp = () => {
  return (
    <ApolloProvider client={client()}>
      <AuthContextProvider>
        <PeopleContextProvider>
          <Router>
            <AppContainer />
          </Router>
        </PeopleContextProvider>
      </AuthContextProvider>
    </ApolloProvider>
  );
};

render(<RootApp />, document.querySelector('#root'));
