import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  NavbarToggler,
  Collapse
} from 'reactstrap';

class Header extends Component {
  constructor(props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render() {
    return (
      <div>
        <Navbar color='faded' light expand='md'>
          <NavbarBrand href='/'>Megaphone</NavbarBrand>
          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
          <Collapse isOpen={!this.state.collapsed} navbar>
            <Nav className='ml-auto' navbar>
              <NavItem>
                <NavLink href='/login'>Login</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href='/signup'>Sign Up</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  };
};

export default withRouter(Header);
