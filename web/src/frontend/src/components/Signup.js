import React, { Component } from 'react';
import { Container, Alert } from 'reactstrap';
import { withRouter } from 'react-router-dom';

import SignupForm from './SignupForm';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {alerted: false, alertedMessage: ''};
    this.openAlert = this.openAlert.bind(this);
    this.redirectToDashboard = this.redirectToDashboard.bind(this)
  }

  openAlert(message) {this.setState({alerted: true, alertedMessage: message})}
  redirectToDashboard() {this.props.history.push('/dashboard');}

  render() {
    return (
      <Container>
        <Alert isOpen={this.state.alerted} color='danger'>{this.state.alertedMessage}</Alert>
        <h1>Signup</h1>
        <SignupForm openAlert={this.openAlert} redirectToDashboard={this.redirectToDashboard}/>
      </Container>
    );
  };
};

export default withRouter(Signup)
