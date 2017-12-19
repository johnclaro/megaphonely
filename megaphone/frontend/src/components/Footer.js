import React from 'react';
import { Row, Col, Nav, NavItem, NavLink } from 'reactstrap';

var footerStyle = {
  background: '#F6F9FC',
  padding: 25
}

export default class Footer extends React.Component {
  render() {
    return (
      <div className='text-center' style={footerStyle}>
        <Row>
          <Col lg='3' xs='6'>
            <p>Megaphone</p>
            <Nav vertical>
              <NavItem>
                <NavLink href='/plans'>Plans</NavLink>
              </NavItem>
            </Nav>
          </Col>
          <Col lg='3' xs='6'>
            <p>Company</p>
            <Nav vertical>
              <NavItem>
                <NavLink href='/about'>About</NavLink>
              </NavItem>
            </Nav>
          </Col>
          <Col lg='3' xs='6'>
            <p>Support</p>
            <Nav vertical>
              <NavItem>
                <NavLink href='/contact'>Contact</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href='/privacy'>Privacy</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href='/terms'>Terms</NavLink>
              </NavItem>
            </Nav>
          </Col>
          <Col lg='3' xs='6'>
            <p>Connect</p>

            <Nav vertical>
              <NavItem>
                <NavLink href='https://www.twitter.com/megaphonesm'>Twitter</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href='https://www.facebook.com/megaphone.social'>Facebook</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href='https://www.instagram.com/megaphonesm'>Instagram</NavLink>
              </NavItem>
            </Nav>
          </Col>
          </Row>
      </div>
    );
  }
}
