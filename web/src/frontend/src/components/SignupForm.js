import React, { Component } from 'react';

import yup from 'yup';
import { Formik } from 'formik';
import { Button, Form, Input, FormGroup } from 'reactstrap';

const SignupSchema = yup.object().shape({
  firstName: yup.string().max(100, 'First name must be fewer than 100 characters').required('Please enter your first name'),
  lastName: yup.string().max(100, 'Last name must be fewer than 100 characters'),
  email: yup.string().email('Email is not valid').required('Please enter an email address'),
  password: yup.string().min(6, 'Password must contain at least 6 characters long').required('Please enter a password')
})


export default class SignupForm extends Component {
  render() {
    const { redirectToDashboard, openAlert } = this.props;
    return (
      <Formik
        validationSchema={SignupSchema}
        initialValues={{
          firstName: 'John', lastName: 'Doe', email: 'johndoe@gmail.com',
          password: 'johndoe',
        }}
        onSubmit={(
          values,
          { setSubmitting, setErrors }
        ) => {
          fetch('http://localhost:3001/account', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(values)
          })
          .then(response => {
            return response.json()
            .then(data => {
              if (response.status === 200) {
                localStorage.setItem('jwt', data.token);
                if (redirectToDashboard) redirectToDashboard();
              } else {
                console.log(data)
                return Promise.reject(data)
              }
            })
          })
          .catch(error => {
            if (openAlert) {
              if (error === 'NetworkError when attempting to fetch resource.') {
                openAlert('Our signup server is currently down. Please try again later.')
              } else {
                openAlert(error)
              }
            } else {
              console.error(error)
            }
          })
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
