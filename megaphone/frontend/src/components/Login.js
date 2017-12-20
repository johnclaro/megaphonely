import React from 'react';
import { Container } from 'reactstrap';

import LoginForm from './LoginForm';

export default class Login extends React.Component {
  render() {
    return (
      <Container>
        <h1>Login</h1>
        <LoginForm/>
      </Container>
    );
  };
};
