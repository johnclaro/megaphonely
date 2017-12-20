import React, { Component } from 'react';

import yup from 'yup';
import { Formik } from 'formik';
import { Button, Form, Input, FormGroup } from 'reactstrap';

const SignupSchema = yup.object().shape({
  firstName: yup.string().max(100, 'First name must be fewer than 100 characters').required('Please enter your first name'),
  lastName: yup.string().max(100, 'Last name must be fewer than 100 characters'),
  email: yup.string().email('Email is not valid').required('Required'),
  password: yup.string().min(6, 'Password must contain at least 6 characters long').required('Required')
})


export default class SignupForm extends Component {
  render() {
    const { redirectToDashboard, modal } = this.props
    return (
      <Formik
        validationSchema={SignupSchema}
        initialValues={{
          firstName: 'Foo', lastName: 'Bar', email: 'foobar@gmail.com',
          password: 'foobar',
        }}
        onSubmit={(
          values,
          { setSubmitting, setErrors /* setValues and other goodies */ }
        ) => {
          fetch('http://localhost:3001/account', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(values)
          })
          .then(success => success.json())
          .then(data => {
            localStorage.setItem('jwt', data.token);
            if (modal) modal();
            if (redirectToDashboard) redirectToDashboard();
          })
          .catch(error => console.error(error))
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
              {touched.firstName && errors.firstName && <div>{errors.firstName}</div>}
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
              {touched.lastName && errors.lastName && <div>{errors.lastName}</div>}
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
              Sign up
            </Button>
            <p>By clicking sign up, I agree to the Megaphone <a href='/privacy'>Privacy Policy</a> and <a href='/terms'> Terms of Services </a> </p>
          </Form>
        )}
      />
    )
  }
}
