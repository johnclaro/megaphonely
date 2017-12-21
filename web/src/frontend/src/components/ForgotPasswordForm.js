import React from 'react';
import { withRouter } from 'react-router-dom';
import { Formik } from 'formik';
import { Button, Form, Input, FormGroup } from 'reactstrap';

import { forgotPassword, alert } from '../api';
import { ForgotPasswordValidator } from '../validators';

class ForgotPasswordForm extends React.Component {
  render() {
    const { openAlert } = this.props;
    return (
      <Formik
        validationSchema={ForgotPasswordValidator}
        initialValues={{
          email: 'jkrclaro@outlook.com'
        }}
        onSubmit={(
          values,
          { setSubmitting, setErrors /* setValues and other goodies */ }
        ) => {
          forgotPassword()
          .then(success => alert(openAlert, success, 'success'))
          .catch(error => alert(openAlert, error, 'danger'))
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
            <Button className='btn-block' type='submit' disabled={isSubmitting}>
              Send me instructions
            </Button>
          </Form>
        )}
      />
    )
  }
}

export default withRouter(ForgotPasswordForm)
