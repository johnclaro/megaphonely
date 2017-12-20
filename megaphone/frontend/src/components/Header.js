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
  render() {
    return (
      <div>
        <Navbar color='faded' light expand='md'>
          <NavbarBrand href='/'>Megaphone</NavbarBrand>
          <Nav className='ml-auto' navbar>
            <NavItem>
              <NavLink href='/login' style={pointerCursorStyle}>Login</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href='/signup' style={pointerCursorStyle}>Sign Up</NavLink>
            </NavItem>
          </Nav>
        </Navbar>
      </div>
    );
  };
};
