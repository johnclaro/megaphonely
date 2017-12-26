import React, { Component } from 'react';
import {
  Container, Modal, ModalHeader, ModalBody, ModalFooter, ListGroup, ListGroupItem
} from 'reactstrap';

export default class ConnectNetworkModal extends Component {
  render() {
    const { modalState, modalToggle } = this.props;
    return (
      <Container>
        <Modal isOpen={modalState} toggle={modalToggle}>
          <ModalHeader toggle={modalToggle}>Your networks</ModalHeader>
          <ModalBody>
            <ListGroup>
              <ListGroupItem tag='a' href='/connect/facebook' action>Facebook</ListGroupItem>
              <ListGroupItem tag='a' href='/connect/twitter' action>Twitter</ListGroupItem>
              <ListGroupItem tag='a' href='/connect/linkedin' action>LinkedIn</ListGroupItem>
            </ListGroup>
          </ModalBody>
        </Modal>
      </Container>
    );
  };
};
