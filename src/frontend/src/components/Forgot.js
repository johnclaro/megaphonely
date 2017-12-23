import React, { Component } from 'react';
import { Container, Alert } from 'reactstrap';

import ForgotForm from './ForgotForm';

export default class Forgot extends Component {
  constructor(props) {
    super(props);
    this.state = {alerted: false, alertedMessage: '', alertedColor: ''};
    this.openAlert = this.openAlert.bind(this);
    this.redirectToDashboard = this.redirectToDashboard.bind(this)
  }

  openAlert(alertedMessage, alertedColor) {
    this.setState({
      alerted: true, alertedMessage: alertedMessage, alertedColor: alertedColor
    })
  }

  redirectToDashboard() {this.props.history.push('/dashboard');}

  render() {
    return (
      <Container>
        <Alert isOpen={this.state.alerted} color={this.state.alertedColor}>{this.state.alertedMessage}</Alert>
        <h1>Forgot your password?</h1>
        <ForgotForm openAlert={this.openAlert}/>
      </Container>
    );
  };
};
