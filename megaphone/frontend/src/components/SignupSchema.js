import yup from 'yup';

const SignupSchema = yup.object().shape({
  firstName: yup.string().required('Please enter your first name'),
  lastName: yup.string(),
  email: yup.string().email('Email is not valid').required('Required'),
  password: yup.string().min(6, 'Password must contain at least 6 characters long').required('Required')
})

export default SignupSchema;
