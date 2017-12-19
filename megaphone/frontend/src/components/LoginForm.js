import React from 'react';

import yup from 'yup';
import { Formik } from 'formik';
import { Button, Form, Input, FormGroup } from 'reactstrap';

const LoginSchema = yup.object().shape({
  email: yup.string().email('Email is not valid').required('Required'),
  password: yup.string().min(6, 'Password must contain at least 6 characters long').required('Required')
})

export default class LoginForm extends React.Component {
  render() {
    return (
      <Formik
        validationSchema={LoginSchema}
        initialValues={{
          email: 'jkrclaro@outlook.com',
          password: 'postmalone',
        }}
        onSubmit={(
          values,
          { setSubmitting, setErrors /* setValues and other goodies */ }
        ) => {
          const url = 'http://localhost:3001/account/authenticate'
          fetch(url, {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({'username': 'jkrclaro@outlook.com', 'password': 'postmalone'})
          })
          .then(response => response.json())
          .then(token => {
            console.log(token)
          })
          .catch(error => setErrors(error))
          setSubmitting(false)
        }}
        render={({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Input
                type='email'
                name='email'
                placeholder='Email'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
              />
              {touched.email && errors.email && <div>{errors.email}</div>}
            </FormGroup>
            <FormGroup>
              <Input
                type='password'
                name='password'
                placeholder='Password'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              />
              {touched.password && errors.password && <div>{errors.password}</div>}
            </FormGroup>
            <Button className='btn-block' type='submit' disabled={isSubmitting}>
              Login
            </Button>
            <a href='/forgot_password'>Forgot password?</a>
            <br/>
            <span>{"Don't have an account?"} <a href='/signup'>Sign Up</a></span>
          </Form>
        )}
      />
    )
  }
}
