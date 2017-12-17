'use strict'

import React from 'react';

import anonymousImg from '../images/anonymous.png';

const formatName = user => `${user.firstName} ${user.lastName}`;

const user = {
  firstName: 'John',
  lastName: 'Doe'
};

const Layout = () => {
    return (
      <div className='container'>
        <h1>Hello, {formatName(user)}!</h1>
      </div>
   )
};

export default Layout;
