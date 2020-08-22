import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppContainer } from '../client/AppContainer';
import { client } from './client';

const RootApp = () => {
  return (
    <ApolloProvider client={client()}>
      <Router>
        <AppContainer />
      </Router>
    </ApolloProvider>
  );
};

render(<RootApp />, document.querySelector('#root'));
