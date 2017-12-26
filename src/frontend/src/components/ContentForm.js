import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Formik } from 'formik';
import { Form, FormGroup, Input, Button } from 'reactstrap';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';

import { ContentValidator } from '../validators';
import { content } from '../apis';


class ContentForm extends Component {
  constructor(props) {
    super(props);
    const flatpickrOptions = {
      minDate: 'today', enableTime: true, time_24hr: true, minuteIncrement: 1,
      dateFormat: 'd/m/Y H:i',
    };
    this.state = { flatpickrOptions };
  }

  render() {
    return (
      <Formik
        validationSchema={ContentValidator}
        initialValues={{
          message: 'Just know I mean it', schedule: new Date()
        }}
        onSubmit={(
          values,
          { setSubmitting, setErrors }
        ) => {
          console.log(values);
          content(values)
          .then(res => console.log(res))
          .catch(err => console.error(err))
        }}
        render={({
          values,
          errors,
          touched,
          setFieldValue,
          setFieldTouched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Input
                type='textarea'
                name='message'
                placeholder='What do you want to share?'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.message}
              />
              {touched.message && errors.message && <div className='error-input'>{errors.message}</div>}
            </FormGroup>
            <FormGroup>
              <Input
                id='media'
                type='file'
                name='media'
                onChange={(event) => {
                  setFieldValue('media', event.currentTarget.files[0])
                }}
              />
            </FormGroup>
            <FormGroup row>
              <Flatpickr
                id='schedule'
                name='schedule'
                className='schedule-at-flatpickr'
                options={this.state.flatpickrOptions}
                onChange={(event) => {
                  setFieldValue('schedule', event[0])
                  setFieldTouched('schedule', true)
                }}
                value={values.schedule}
              />
              {touched.schedule && errors.schedule && <div className='error-input'>{errors.schedule}</div>}
            </FormGroup>
            <Button className='btn-block' type='submit' disabled={isSubmitting}>
              Schedule
            </Button>
          </Form>
        )}
      />
    )
  }
}

export default withRouter(ContentForm)
