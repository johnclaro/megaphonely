import React, { Component } from 'react';
import { Container, Button } from 'reactstrap';
import { content } from '../apis';

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
