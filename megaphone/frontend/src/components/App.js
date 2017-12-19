import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';

import Dashboard from './Dashboard';
import Home from './Home'
import NotFound from './NotFound';
import Footer from './Footer';
import Header from './Header';

const App = () => (
  <div>
    <Header />
    <Container>
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route path='/dashboard' component={Dashboard}/>
        <Route component={NotFound} />
      </Switch>
    </Container>
    <Footer />
  </div>
)

export default App;
