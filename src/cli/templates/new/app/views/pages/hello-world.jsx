import React from 'react';
import HelloWorldText from '../components/hello-world-text.jsx';

export default class HelloWorld extends React.Component {
  render() {
    return (
      <div>
        <h3>I am inside HelloWorld</h3>
        <HelloWorldText/>
      </div>
    )
  }
}