import React from 'react';
import { Formik } from 'formik';
import { Button, Form, Input, FormGroup } from 'reactstrap';

import { LoginValidator } from '../validators';
import { login } from '../apis';

export default class LoginForm extends React.Component {
  render() {
    const { redirect } = this.props;
    return (
      <Formik
        validationSchema={LoginValidator}
        initialValues={{
          email: 'jkrclaro@outlook.com', password: 'johndoe'
        }}
        onSubmit={(
          values,
          { setSubmitting, setErrors }
        ) => {
          login(values)
          .then(authenticated => {
            localStorage.setItem('jwt', authenticated.data.token)
            redirect('/dashboard')
          })
          .catch(err => setErrors(err.response.data));
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
              {touched.email && errors.email && <div className='error-input'>{errors.email}</div>}
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
              {touched.password && errors.password && <div className='error-input'>{errors.password}</div>}
            </FormGroup>
            <Button className='btn-block' type='submit' disabled={isSubmitting}>
              Login
            </Button>
            <a href='/forgot'>Forgot password?</a>
            <br/>
            <span>{"Don't have an account?"} <a href='/signup'>Sign Up</a></span>
          </Form>
        )}
      />
    )
  };
};
