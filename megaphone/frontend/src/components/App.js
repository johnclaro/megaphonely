import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Dashboard from './Dashboard';
import Home from './Home'
import NotFound from './NotFound';
import Footer from './Footer';
import Header from './Header';
import Login from './Login';
import Signup from './Signup';

const App = () => (
  <div>
    <Header />
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/login' component={Login}/>
      <Route path='/signup' component={Signup}/>
      <Route path='/dashboard' component={Dashboard}/>
      <Route component={NotFound} />
    </Switch>
    <Footer />
  </div>
)

export default App;
