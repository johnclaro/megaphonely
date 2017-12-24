import React from 'react';
import { withRouter } from 'react-router-dom';
import { Formik } from 'formik';
import { Button, Form, Input, FormGroup } from 'reactstrap';

import { ForgotValidator } from '../validators';
import { forgot } from '../apis';

class ForgotForm extends React.Component {
  render() {
    const { alert } = this.props;
    return (
      <Formik
        validationSchema={ForgotValidator}
        initialValues={{
          email: 'jkrclaro@outlook.com'
        }}
        onSubmit={(
          values,
          { setSubmitting, setErrors }
        ) => {
          forgot(values)
          .then(forgotten => alert(values.email, 'success'))
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

export default withRouter(ForgotForm)
