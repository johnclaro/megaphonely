import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './components/App';

import './css/index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'flatpickr/dist/themes/airbnb.css';

import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);
registerServiceWorker();
