import React from 'react';
import { Container } from 'reactstrap';

import LoginForm from './LoginForm';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.redirectToDashboard = this.redirectToDashboard.bind(this);
  }

  redirectToDashboard() {
    this.props.history.push('/dashboard');
  }

  render() {
    return (
      <Container>
        <h1>Login</h1>
        <LoginForm redirectToDashboard={this.redirectToDashboard}/>
      </Container>
    );
  };
};
