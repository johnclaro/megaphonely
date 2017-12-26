import React, { Component } from 'react';
import { Container } from 'reactstrap';

import ContentForm from './ContentForm';

export default class Dashboard extends Component {
  render() {
    return (
      <Container>
        <h1>Dashboard</h1>
        <ContentForm/>
      </Container>
    );
  };
};
