import React from 'react';
import { Container } from 'reactstrap';

export default class Dashboard extends React.Component {
  render() {
    fetch('http://localhost:3001/settings', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('jwt')
      }
    })
    .then(success => success.json())
    .then(data => console.log(data))
    .catch(error => console.error(error))
    return (
      <Container>
        <h1>Dashboard</h1>
      </Container>
    );
  };
};
