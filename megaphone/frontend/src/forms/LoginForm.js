import React from 'react';
import { Formik } from 'formik';

import LoginSchema from './LoginSchema';

export default class LoginForm extends React.Component {
  render() {
    return (
      <Formik
        validationSchema={LoginSchema}
        initialValues={{
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
          console.log('Logging in..')
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
          <form onSubmit={handleSubmit}>
            <div className='input-group'>
              <input
                type='email'
                name='email'
                placeholder='Email'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
              />
              {touched.email && errors.email && <div>{errors.email}</div>}
            </div>

            <div className='input-group'>
              <input
                type='password'
                name='password'
                placeholder='Password'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              />
              {touched.password && errors.password && <div>{errors.password}</div>}
            </div>
            <button type='submit' disabled={isSubmitting}>
              Submit
            </button>
          </form>
        )}
      />
    )
  }
}
