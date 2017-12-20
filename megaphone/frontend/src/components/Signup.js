import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { withRouter } from 'react-router-dom';

import SignupForm from './SignupForm';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.redirectToDashboard = this.redirectToDashboard.bind(this)
  }

  redirectToDashboard() {
    this.props.history.push('/dashboard')
  }

  render() {
    return (
      <Container>
        <h1>Signup</h1>
        <SignupForm redirectToDashboard={this.redirectToDashboard}/>
      </Container>
    );
  };
};

export default withRouter(Signup)
