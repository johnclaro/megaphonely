import React, { Component } from 'react';
import { Container, Col, Row } from 'reactstrap';

import ContentForm from './ContentForm';

export default class Dashboard extends Component {
  render() {
    return (
      <Container>
        <Row>
          <Col lg={4}>
            <h1>Welcome</h1>
            <ContentForm/>
          </Col>
          <Col lg={8}>
            <h1>Contents</h1>
          </Col>
        </Row>
      </Container>
    );
  };
};
