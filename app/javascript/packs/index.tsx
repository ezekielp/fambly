import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider } from '@apollo/client';
import { AuthContextProvider } from 'client/contexts/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppContainer } from '../client/AppContainer';
import { client } from './client';
import { ScrollToTop } from 'client/common/ScrollToTop';

const RootApp = () => {
  return (
    <ApolloProvider client={client()}>
      <AuthContextProvider>
        <Router>
          <ScrollToTop />
          <AppContainer />
        </Router>
      </AuthContextProvider>
    </ApolloProvider>
  );
};

render(<RootApp />, document.querySelector('#root'));
