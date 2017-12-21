import React from 'react';
import { withRouter } from 'react-router-dom';

import { Formik } from 'formik';
import { Button, Form, Input, FormGroup } from 'reactstrap';

import { LoginValidator } from '../validators';
import { login, alert } from '../api';

class LoginForm extends React.Component {
  render() {
    const { redirectToDashboard, openAlert } = this.props;
    return (
      <Formik
        validationSchema={LoginValidator}
        initialValues={{
          email: 'johndoe@gmail.com', password: 'johndoe'
        }}
        onSubmit={(
          values,
          { setSubmitting, setErrors }
        ) => {
          login(values)
          .then(loggedIn => {
            if (redirectToDashboard) redirectToDashboard()
          })
          .catch(error => alert(openAlert, error, 'danger'))
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
            <a href='/forgot_password'>Forgot password?</a>
            <br/>
            <span>{"Don't have an account?"} <a href='/signup'>Sign Up</a></span>
          </Form>
        )}
      />
    )
  }
}

export default withRouter(LoginForm)
