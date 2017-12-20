import React from 'react';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';

export default class Header extends React.Component {
  render() {
    return (
      <div>
        <Navbar color='faded' light expand='md'>
          <NavbarBrand href='/'>Megaphone</NavbarBrand>
          <Nav className='ml-auto' navbar>
            <NavItem>
              <NavLink href='/login'>Login</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href='/signup'>Sign Up</NavLink>
            </NavItem>
          </Nav>
        </Navbar>
      </div>
    );
  };
};
