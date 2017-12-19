import React from 'react';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';

const pointerCursorStyle = {
  cursor: 'pointer'
}

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginModal: false,
      registerModal: false
    };

    this.toggleLoginModal = this.toggleLoginModal.bind(this);
    this.toggleRegisterModal = this.toggleRegisterModal.bind(this);
  }

  toggleLoginModal() {
    this.setState({
      loginModal: !this.state.loginModal
    });
  }

  toggleRegisterModal() {
    this.setState({
      registerModal: !this.state.registerModal
    });
  }

  render() {
    return (
      <div>
        <Navbar color='faded' light expand='md'>
          <NavbarBrand href='/'>Megaphone</NavbarBrand>
          <Nav className='ml-auto' navbar>
            <NavItem>
              <NavLink onClick={this.toggleLoginModal} style={pointerCursorStyle}>Login</NavLink>
            </NavItem>
            <NavItem>
              <NavLink onClick={this.toggleRegisterModal} style={pointerCursorStyle}>Register</NavLink>
            </NavItem>
          </Nav>
        </Navbar>
        <div>
          <Modal isOpen={this.state.loginModal} toggleLoginModal={this.toggleLoginModal} className={this.props.className}>
            <ModalHeader toggleLoginModal={this.toggleLoginModal}>Login</ModalHeader>
            <ModalBody>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </ModalBody>
            <ModalFooter>
              <Button color='primary' onClick={this.toggleLoginModal}>Do Something</Button>{' '}
              <Button color='secondary' onClick={this.toggleLoginModal}>Cancel</Button>
            </ModalFooter>
          </Modal>
          <Modal isOpen={this.state.registerModal} toggleRegisterModal={this.toggleRegisterModal} className={this.props.className}>
            <ModalHeader toggleRegisterModal={this.toggleRegisterModal}>Register</ModalHeader>
            <ModalBody>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </ModalBody>
            <ModalFooter>
              <Button color='primary' onClick={this.toggleRegisterModal}>Do Something</Button>{' '}
              <Button color='secondary' onClick={this.toggleRegisterModal}>Cancel</Button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    );
  };
};
