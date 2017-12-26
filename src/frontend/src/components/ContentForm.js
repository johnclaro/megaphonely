import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Formik } from 'formik';
import { Form, FormGroup, Input, Button } from 'reactstrap';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/airbnb.css';
import Select from 'react-select';
import 'react-select/dist/react-select.css'

import { ContentValidator } from '../validators';
import { content } from '../apis';


class ContentForm extends Component {
  constructor(props) {
    super(props);
    let selectOptions = [{value: 'now', label: 'Now'}];
    const today = new Date();
    const hours = today.getHours();
    const diff = (24 - hours) * 2;
    const range = Array.apply(null, Array(diff)).map(function (_, i) {return i});
    for (let x in range) {
      const time = hours + parseInt(x, 10) / 2;
      if (time % 1 === 0) {
        selectOptions.push({value: time, label: `${time}:00`});
      } else {
        selectOptions.push({value: time, label: `${parseInt(time, 10)}:30`});
      }
    }
    selectOptions.push({value: 'now', label: 'Now'});

    const flatpickrOptions = { minDate: 'today', dateFormat: 'd/m/Y' }
    this.state = { selectOptions, flatpickrOptions, scheduleTime: 'now' };
  }

  render() {
    const today = new Date();

    return (
      <Formik
        validationSchema={ContentValidator}
        initialValues={{
          message: 'Just know I mean it', scheduleAt: new Date()
        }}
        onSubmit={(
          values,
          { setSubmitting, setErrors }
        ) => {
          console.log(values)
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
                id='scheduleAt'
                onChange={(event) => { setFieldValue('scheduleTime', '')}}
                value={values.scheduleAt}
                options={this.state.flatpickrOptions}
              />
              <Select
                name='schedule-time'
                className='schedule-at-select'
                value={values.scheduleTime}
                clearable={false}
                onChange={(event => {
                  const scheduleTime = event.value || 'now'
                  if (scheduleTime === 'now') {
                    setFieldValue('scheduleAt', new Date())
                  }
                  setFieldValue('scheduleTime', scheduleTime)
                })}
                options={this.state.selectOptions}
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
