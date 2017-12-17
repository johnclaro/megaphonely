'use strict';

import './css/style.css';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter,
  Route,
  Link
} from 'react-router-dom';

import Home from './components/Home'
import About from './components/About'

ReactDOM.render((
  <BrowserRouter>
    <div>
      <ul>
        <li><Link to='/'>Home</Link></li>
        <li><Link to='/about'>About</Link></li>
      </ul>

      <hr/>

      <Route exact path='/' component={Home}/>
      <Route path='/about' component={About}/>
    </div>
  </BrowserRouter>),
  document.querySelector('#root'));
