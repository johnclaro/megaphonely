import yup from 'yup';

const LoginSchema = yup.object().shape({
  email: yup.string().email('Email is not valid').required('Required'),
  password: yup.string().min(6, 'Password must contain at least 6 characters long').required('Required')
})

export default LoginSchema;
