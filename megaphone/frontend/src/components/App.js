import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Dashboard from './Dashboard';
import Home from './Home'
import NotFound from './NotFound';

const App = () => (
  <Switch>
    <Route exact path='/' component={Home}/>
    <Route path='/dashboard' component={Dashboard}/>
    <Route component={NotFound} />
  </Switch>
)

export default App;
