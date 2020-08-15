import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom';
import { AppContainer } from '../client/AppContainer';

const RootApp = () => {
  return (
    <Router>
      <AppContainer />
    </Router>
  )
};

render(<RootApp />, document.querySelector('#root'));
