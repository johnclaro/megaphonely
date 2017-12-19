import React from 'react';

import yup from 'yup';
import { Formik } from 'formik';
import { Button, Form, Input, FormGroup } from 'reactstrap';

const SignupSchema = yup.object().shape({
  firstName: yup.string().max(100, 'First name must be fewer than 100 characters').required('Please enter your first name'),
  lastName: yup.string().max(100, 'Last name must be fewer than 100 characters'),
  email: yup.string().email('Email is not valid').required('Required'),
  password: yup.string().min(6, 'Password must contain at least 6 characters long').required('Required')
})


export default class SignupForm extends React.Component {
  render() {
    return (
      <Formik
        validationSchema={SignupSchema}
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          password: '',
        }}
        onSubmit={(
          values,
          { setSubmitting, setErrors /* setValues and other goodies */ }
        ) => {
          // LoginToMyApp(values).then(
          //   user => {
          //     setSubmitting(false);
          //     // do whatevs...
          //     // props.updateUser(user)
          //   },
          //   errors => {
          //     setSubmitting(false);
          //     // Maybe transform your API's errors into the same shape as Formik's
          //     setErrors(transformMyApiErrors(errors));
          //   }
          // );
          console.log('Signing up..')
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
          </Form>
        )}
      />
    )
  }
}
