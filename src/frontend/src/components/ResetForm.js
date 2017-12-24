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
          data,
          { setSubmitting, setErrors }
        ) => {
          reset(data, token)
          .then(changed => {
            return changed.json()
            .then(res => changed.ok ? redirect('/dashboard') : null)
          })
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
