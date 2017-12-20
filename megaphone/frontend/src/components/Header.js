import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
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

const pointerCursorStyle = {cursor: 'pointer'};

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {loginModal: false, signupModal: false};

    this.toggleLogin = this.toggleLogin.bind(this);
    this.toggleSignup = this.toggleSignup.bind(this);
    this.redirectToDashboard = this.redirectToDashboard.bind(this);
  }

  toggleLogin() {
    if (this.props.location.pathname === '/') {
      this.setState({loginModal: !this.state.loginModal});
    }
  }

  toggleSignup() {
    if (this.props.location.pathname === '/') {
      this.setState({signupModal: !this.state.signupModal});
    }
  }

  redirectToDashboard() {
    this.props.history.push('/dashboard');
  }

  render() {
    return (
      <div>
        <Navbar color='faded' light expand='md'>
          <NavbarBrand href='/'>Megaphone</NavbarBrand>
          <Nav className='ml-auto' navbar>
            <NavItem>
              <NavLink onClick={this.toggleLogin} style={pointerCursorStyle}>Login</NavLink>
            </NavItem>
            <NavItem>
              <NavLink onClick={this.toggleSignup} style={pointerCursorStyle}>Sign Up</NavLink>
            </NavItem>
          </Nav>
        </Navbar>
        <div>
          <Modal isOpen={this.state.loginModal} toggle={this.toggleLogin} className={this.props.className}>
            <ModalHeader toggle={this.toggleLogin}>Login</ModalHeader>
            <ModalBody>
              <LoginForm redirectToDashboard={this.redirectToDashboard} modal={this.toggleLogin}/>
            </ModalBody>
          </Modal>
          <Modal isOpen={this.state.signupModal} toggle={this.toggleSignup} className={this.props.className}>
            <ModalHeader toggle={this.toggleSignup}>Sign Up</ModalHeader>
            <ModalBody>
              <SignupForm redirectToDashboard={this.redirectToDashboard} modal={this.toggleSignup}/>
            </ModalBody>
          </Modal>
        </div>
      </div>
    );
  };
};

export default withRouter(Header);
