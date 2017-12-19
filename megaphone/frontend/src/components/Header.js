import React from 'react';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Modal,
  ModalHeader,
  ModalBody
} from 'reactstrap';

import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const pointerCursorStyle = {
  cursor: 'pointer'
}

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loginModal: false,
      signupModal: false
    };

    this.toggleLoginModal = this.toggleLoginModal.bind(this);
    this.toggleSignupModal = this.toggleSignupModal.bind(this);
  }

  toggleLoginModal() {
    this.setState({loginModal: !this.state.loginModal});
  }

  toggleSignupModal() {
    this.setState({signupModal: !this.state.signupModal});
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
              <NavLink onClick={this.toggleSignupModal} style={pointerCursorStyle}>Sign Up</NavLink>
            </NavItem>
          </Nav>
        </Navbar>
        <div>
          <Modal isOpen={this.state.loginModal} toggle={this.toggleLoginModal} className={this.props.className}>
            <ModalHeader toggle={this.toggleLoginModal}>Login</ModalHeader>
            <ModalBody>
              <LoginForm/>
            </ModalBody>
          </Modal>
          <Modal isOpen={this.state.signupModal} toggle={this.toggleSignupModal} className={this.props.className}>
            <ModalHeader toggle={this.toggleSignupModal}>Sign Up</ModalHeader>
            <ModalBody>
              <SignupForm/>
            </ModalBody>
          </Modal>
        </div>
      </div>
    );
  };
};
