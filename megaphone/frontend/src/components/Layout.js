'use strict'

import React from 'react';

const formatName = user => `${user.firstName} ${user.lastName} on ${process.env.APPLE}`;

const user = {
  firstName: 'John',
  lastName: 'Doe'
};

const Layout = () => {
    return (
      <div class='container'>
        <h1>Hello, {formatName(user)}!</h1>
      </div>
   )
};

export default Layout;
