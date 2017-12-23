import React, { Component } from 'react';
import { Container } from 'reactstrap';

import ForgotForm from './ForgotForm';

export default class Forgot extends Component {
  constructor(props) {
    super(props);
    this.redirect = this.redirect.bind(this)
  }

  redirect(link) {this.props.history.push(link)};

  render() {
    return (
      <Container>
        <h1>Forgot your password?</h1>
        <ForgotForm/>
      </Container>
    );
  };
};
