import React from 'react';
import { withRouter } from 'react-router-dom';
import { Formik } from 'formik';
import { Button, Form, Input, FormGroup } from 'reactstrap';

import { ResetValidator } from '../validators';
import { reset } from '../apis';

class ResetForm extends React.Component {
  render() {
    const { redirect, token } = this.props;
    return (
      <Formik
        validationSchema={ResetValidator}
        initialValues={{
          password: 'johndoe'
        }}
        onSubmit={(
          values,
          { setSubmitting, setErrors }
        ) => {
          reset(values, token)
          .then(changed => redirect('/dashboard'))
          .catch(err => setErrors(err))
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
                type='password'
                name='password'
                placeholder='New password'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              />
              {touched.password && errors.password && <div className='error-input'>{errors.password}</div>}
            </FormGroup>
            <Button className='btn-block' type='submit' disabled={isSubmitting}>
              Reset my password
            </Button>
          </Form>
        )}
      />
    )
  }
}

export default withRouter(ResetForm)
