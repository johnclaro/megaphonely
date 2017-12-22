const yup = require('yup');

const ForgotPasswordValidator = yup.object().shape({
  email: yup.string().email('Email is not valid').required('Please enter an email address')
});

const LoginValidator = yup.object().shape({
  email: yup.string().email('Email is not valid').required('Please enter an email address'),
  password: yup.string().min(6, 'Password must contain at least 6 characters long').required('Please enter a password')
});

const SignupValidator = yup.object().shape({
  firstName: yup.string().trim().max(100, 'First name must be fewer than 100 characters').required('Please enter your first name'),
  lastName: yup.string().trim().max(100, 'Last name must be fewer than 100 characters'),
  email: yup.string().email('Email is not valid').required('Please enter an email address'),
  password: yup.string().min(6, 'Password must contain at least 6 characters long').required('Please enter a password')
});

module.exports = { SignupValidator, LoginValidator, ForgotPasswordValidator };
