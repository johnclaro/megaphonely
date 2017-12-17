'use strict';

import { Route, IndexRoute } from 'react-router';

import IndexPage from './components/IndexPage';

const routes = (
  <Route path='/' component={Layout}>
    <IndexRoute component={IndexPage}/>
  </Route>
)

export default routes
