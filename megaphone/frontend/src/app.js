import './css/style.css';
import React from 'react';
import ReactDOM from 'react-dom';

import Layout from './components/Layout.js';
import IndexPage from './components/IndexPage.js';

ReactDOM.render(
  <IndexPage /> ,
  document.querySelector('#root')
);
