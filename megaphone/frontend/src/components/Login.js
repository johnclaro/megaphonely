import React from 'react';
import { Container, Alert } from 'reactstrap';

import LoginForm from './LoginForm';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {alerted: false, alertedMessage: ''};
    this.openAlert = this.openAlert.bind(this);
    this.redirectToDashboard = this.redirectToDashboard.bind(this);
  }

  openAlert(message) {this.setState({alerted: true, alertedMessage: message})}
  redirectToDashboard() {this.props.history.push('/dashboard');}

  render() {
    return (
      <Container>
      <Alert isOpen={this.state.alerted} color='danger'>{this.state.alertedMessage}</Alert>
        <h1>Login</h1>
        <LoginForm openAlert={this.openAlert} redirectToDashboard={this.redirectToDashboard}/>
      </Container>
    );
  };
};
