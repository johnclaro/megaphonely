import React from 'react';
import {
  BrowserRouter,
  Route,
  Switch
 } from 'react-router-dom';

import Dashboard from './Dashboard';
import Home from './Home'
import NotFound from './NotFound';

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path='/' component={Home}/>
      <Route path='/dashboard' component={Dashboard}/>
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
)

export default App;
