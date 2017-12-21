import React from 'react';
import { Container, Alert } from 'reactstrap';

import ForgotPasswordForm from './ForgotPasswordForm';

export default class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      submittedAlert: false,
      email: ''
    }

    this.toggleSubmittedAlert = this.toggleSubmittedAlert.bind(this)
  }

  toggleSubmittedAlert() {
    this.setState({submittedAlert: true})
  }

  attachSentEmail(email) {
    this.setState({email: email})
  }

  render() {
    return (
      <Container>
        <Alert isOpen={this.state.submittedAlert} color='success'>
          If a Megaphone account exists for this {this.state.email}, an
          e-mail will be sent with further instructions.
        </Alert>

        <h1>Forgot your password?</h1>
        <ForgotPasswordForm toggleSubmittedAlert={this.toggleSubmittedAlert} attachSentEmail={this.attachSentEmail.bind(this)}/>
      </Container>
    );
  };
};
