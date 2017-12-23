import React from 'react';
import { Container } from 'reactstrap';

import LoginForm from './LoginForm';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.redirect = this.redirect.bind(this);
  }

  redirect(link) {this.props.history.push(link)};

  render() {
    return (
      <Container>
        <h1>Login</h1>
        <LoginForm redirect={this.redirect}/>
      </Container>
    );
  };
};
