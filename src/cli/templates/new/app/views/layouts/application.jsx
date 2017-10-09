import React from 'react';

export default class Application extends React.Component {
  render() {
    return (
      <div>
        <h1>I am inside application.jsx</h1>
        { props.children }
      </div>
    )
  }
}