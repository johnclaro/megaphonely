import React from 'react';
import { Container } from 'reactstrap';

import ResetForm from './ResetForm';
import NotFound from './NotFound';

export default class Reset extends React.Component {
  constructor(props) {
    super(props);
    this.redirect = this.redirect.bind(this);
  }

  redirect(link) {this.props.history.push(link)};

  render() {
    if (this.props.match.params.token) {
      return (
        <Container>
          <h1>Reset my password</h1>
          <ResetForm token={this.props.match.params.token} redirect={this.redirect}/>
        </Container>
      );
    } else {
      return (
        <NotFound status={404}/>
      )
    }
  };
};
