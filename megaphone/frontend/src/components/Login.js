import React from 'react';

import LoginForm from '../forms/LoginForm';

export default class Login extends React.Component {
  render() {
    return (
      <div>
        <h1>Login</h1>
        <LoginForm />
      </div>
    )
  }
}
