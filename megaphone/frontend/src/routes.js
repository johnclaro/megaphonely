'use strict';
import React from 'react';
import { Switch, Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';

import Layout from './components/Layout.js';
import IndexPage from './components/IndexPage.js';
import NotFoundPage from './components/NotFoundPage.js'

const routes = (
  <BrowserRouter>
    <Switch>
      <Route path='/' component={Layout}/>
      <Route component={NotFoundPage}/>
    </Switch>
  </BrowserRouter>
)

export default routes;
