import React from 'react';
import { withRouter } from 'react-router-dom';

import yup from 'yup';
import { Formik } from 'formik';
import { Button, Form, Input, FormGroup } from 'reactstrap';

const ForgotPasswordSchema = yup.object().shape({
  email: yup.string().email('Email is not valid').required('Required')
})

class ForgotPasswordForm extends React.Component {
  render() {
    return (
      <Formik
        validationSchema={ForgotPasswordSchema}
        initialValues={{
          email: 'jkrclaro@outlook.com'
        }}
        onSubmit={(
          values,
          { setSubmitting, setErrors /* setValues and other goodies */ }
        ) => {
          fetch('http://localhost:3001/forgot_password', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(values)
          })
          .then(success => success.json())
          .then(data => {
            this.props.toggleSubmittedAlert()
            this.props.attachSentEmail(values.email)
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
