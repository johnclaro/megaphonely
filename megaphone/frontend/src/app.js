'use strict';

import './css/style.css';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Route,
  Link,
  Switch
} from 'react-router-dom';

import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import NotFound from './components/NotFound'

ReactDOM.render((
  <BrowserRouter>
    <div>
      <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/login'>Log In</Link></li>
        <li><Link to='/register'>Register</Link></li>
      </ul>

      <hr/>

      <Switch>
        <Route exact path='/' component={Home}/>
        <Route path='/login' component={Login}/>
        <Route path='/register' component={Register}/>
        <Route component={NotFound}/>
      </Switch>
    </div>
  </BrowserRouter>),
  document.querySelector('#root'));
