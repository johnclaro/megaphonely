import React, { Component } from 'react';
import {
  Container, Modal, ModalHeader, ModalBody, ListGroup, ListGroupItem
} from 'reactstrap';

import { connect } from '../apis';

export default class ConnectNetworkModal extends Component {
  constructor(props) {
    super(props);
    this.connect = this.connect.bind(this);
  };

  connect() {
    connect({})
    .then(s => console.log(s))
    .catch(e => console.error(e))
  };

  render() {
    const { modalState, modalToggle } = this.props;
    return (
      <Container>
        <Modal isOpen={modalState} toggle={modalToggle}>
          <ModalHeader toggle={modalToggle}>Your networks</ModalHeader>
          <ModalBody>
            <ListGroup>
              <ListGroupItem tag='a' href='http://megaphone.dev:3001/auth/facebook'>Connect Facebook</ListGroupItem>
              <ListGroupItem tag='a' href='http://megaphone.dev:3001/auth/twitter'>Connect Twitter</ListGroupItem>
              <ListGroupItem tag='a' href='http://megaphone.dev:3001/auth/linkedin'>Connect LinkedIn</ListGroupItem>
            </ListGroup>
          </ModalBody>
        </Modal>
      </Container>
    );
  };
};
