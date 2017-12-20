import React from 'react';
import { Container } from 'reactstrap';

import SignupForm from './SignupForm';

export default class Signup extends React.Component {
  render() {
    return (
      <Container>
        <h1>Signup</h1>
        <SignupForm/>
      </Container>
    );
  };
};
