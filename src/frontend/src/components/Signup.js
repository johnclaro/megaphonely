import React, { Component } from 'react';
import { Container } from 'reactstrap';

import SignupForm from './SignupForm';

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.redirect = this.redirect.bind(this)
  }

  redirect(link) {this.props.history.push(link)};

  render() {
    return (
      <Container>
        <h1>Signup</h1>
        <SignupForm redirect={this.redirect}/>
      </Container>
    );
  };
};
