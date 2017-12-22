import React, { Component } from 'react';

import { Formik } from 'formik';
import { Button, Form, Input, FormGroup } from 'reactstrap';

import { SignupValidator } from '../validators';
import { signup, login, alert } from '../apis';

export default class SignupForm extends Component {
  render() {
    const { redirectToDashboard, openAlert } = this.props;
    return (
      <Formik
        validationSchema={SignupValidator}
        initialValues={{
          firstName: 'John', lastName: 'Doe', email: 'jkrclaro@outlook.com',
          password: 'johndoe',
        }}
        onSubmit={(
          values,
          { setSubmitting, setErrors }
        ) => {
          signup(values)
          .then(account => login(account))
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
                type='text'
                name='firstName'
                placeholder='First name'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.firstName}
              />
              {touched.firstName && errors.firstName && <div className='error-input'>{errors.firstName}</div>}
            </FormGroup>

            <FormGroup>
              <Input
                type='text'
                name='lastName'
                placeholder='Last name'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.lastName}
              />
              {touched.lastName && errors.lastName && <div className='error-input'>{errors.lastName}</div>}
            </FormGroup>

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
              Sign up
            </Button>
            <p>By clicking sign up, I agree to the Megaphone <a href='/privacy'>Privacy Policy</a> and <a href='/terms'> Terms of Services </a> </p>
          </Form>
        )}
      />
    )
  }
}
