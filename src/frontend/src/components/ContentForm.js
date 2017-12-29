import React, { Component } from 'react';
import { Formik } from 'formik';
import { Form, FormGroup, Input, Button, Col } from 'reactstrap';
import Flatpickr from 'react-flatpickr';
import Select from 'react-select';
import GroupAdd from 'react-icons/lib/md/group-add';
import 'flatpickr/dist/themes/airbnb.css';
import 'react-select/dist/react-select.css';

import ContentFormNetworks from './ContentFormNetworks';
import ConnectNetworkModal from './ConnectNetworkModal';
import { ContentValidator } from '../validators';
import { content } from '../apis';

class ContentForm extends Component {
  constructor(props) {
    super(props);
    const flatpickrOptions = {
      minDate: 'today', enableTime: true, time_24hr: true, minuteIncrement: 1,
      dateFormat: 'd/m/Y H:i',
    };
    this.state = { flatpickrOptions, modal: false };
    this.toggle = this.toggle.bind(this);
  };

  toggle() {
    this.setState({modal: !this.state.modal})
  };

  render() {
    return (
      <Formik
        validationSchema={ContentValidator}
        initialValues={{
          message: '', schedule: new Date(), networks: []
        }}
        onSubmit={(
          values,
          { setSubmitting, setErrors, setFieldTouched }
        ) => {
          content(values)
          .then(res => console.log(res))
          .catch(err => setErrors(err.response.data))
          setSubmitting(false)
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
            <FormGroup row className='content-form-formgroup-row'>
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

            <FormGroup row>
              <Col xs={9}>
                <Select
                  className='select-network'
                  name='networks'
                  multi
                  closeOnSelect={false}
                  placeholder='Select your network(s)'
                  value={values.networks}
                  onChange={(event) => {
                    setFieldValue('networks', event)
                    setFieldTouched('networks', true)
                  }}
                  options={[
                    { value: '123', label: 'megaphonesm', url: 'https://twitter.com/megaphonesm' },
                    { value: '456', label: 'Megaphone', url: 'https://linkedin.com/in/megaphonesm' },
                    { value: '789', label: 'Megaphone', url: 'https://facebook.com/megaphonesm' },
                  ]}
                  optionComponent={ContentFormNetworks}
                />
              </Col>
              <Col xs={3}>
                <GroupAdd color='gray' onClick={this.toggle} size={40} style={{cursor: 'pointer'}}/>
              </Col>
              {touched.networks && errors.networks && <div className='error-input'>{errors.networks}</div>}
            </FormGroup>
            <ConnectNetworkModal modalToggle={this.toggle} modalState={this.state.modal}/>

            <Button className='btn-block' type='submit' disabled={isSubmitting}>
              Schedule
            </Button>
          </Form>
        )}
      />
    )
  };
};

export default ContentForm;
