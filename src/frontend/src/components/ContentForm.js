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
      minDate: 'today', enableTime: true, time_24hr: true, minuteIncrement: 1
      dateFormat: 'd/m/Y H:i',
    }
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
          content(values)
          .then(s => console.log('Success'))
          .catch(e => console.error('Error'))
        }}
        render={({
          values,
          errors,
          touched,
          setFieldValue,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Input type='textarea'
                name='message'
                placeholder='What do you want to share?'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.message}
              />
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
                className='schedule-at-flatpickr'
                id='schedule'
                onChange={(event) => {setFieldValue('schedule', event[0])}}
                value={values.schedule}
                options={this.state.flatpickrOptions}
              />
            </FormGroup>
            <FormGroup>
            </FormGroup>
            <Button className='btn-block' type='submit' disabled={isSubmitting}>
              Submit
            </Button>
          </Form>
        )}
      />
    )
  }
}

export default withRouter(ContentForm)
