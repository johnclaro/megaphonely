import React from 'react';
import { Container } from 'reactstrap';
import decode from 'jwt-decode';

import ResetForm from './ResetForm';
import NotFound from './NotFound';

export default class Reset extends React.Component {
  constructor(props) {
    super(props);
    this.redirect = this.redirect.bind(this);
    this.state = {valid: false}
  };

  componentWillMount() {
    try {
      const decoded = decode(this.props.match.params.token);
      const currentTime = new Date().getTime() / 1000;
      if (currentTime < decoded.exp) {
        decoded.email ? this.setState({valid: true}) : this.setState({valid: false})
      }
    } catch (err) {};
  };

  redirect(link) {this.props.history.push(link)};

  render() {
    if (this.state.valid) {
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
