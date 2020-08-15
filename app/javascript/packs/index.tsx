import React from 'react'
import { render } from 'react-dom'

const RootApp = () => {
  return (
    <div>it's fambly!</div>
  )
};

render(<RootApp />, document.querySelector('#root'));
