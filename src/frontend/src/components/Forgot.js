import React, { Component } from 'react';
import { Container, Alert } from 'reactstrap';

import ForgotForm from './ForgotForm';

export default class Forgot extends Component {
  constructor(props) {
    super(props);
    this.state = {alerted: false, email: ''};
    this.alert = this.alert.bind(this);
  };

  alert(email) {this.setState({alerted: true, email })};

  render() {
    return (
      <Container>
        <Alert isOpen={this.state.alerted} color='success'>
          If a Megaphone account exists for {this.state.email},
          an e-mail will be sent with further instructions.
        </Alert>
        <h1>Forgot your password?</h1>
        <ForgotForm alert={this.alert}/>
      </Container>
    );
  };
};
