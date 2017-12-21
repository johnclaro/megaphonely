const yup = require('yup')

const AccountSchema = yup.object().shape({
  firstName: yup.string().max(100, 'First name must be fewer than 100 characters').required('Please enter your first name'),
  lastName: yup.string().max(100, 'Last name must be fewer than 100 characters'),
  email: yup.string().email('Email is not valid').required('Please enter an email address'),
  password: yup.string().min(6, 'Password must contain at least 6 characters long').required('Please enter a password')
})

//check validity
AccountSchema.validate({name: 'jimmy', password: '123456'})
.then(success => console.log(success))
.catch(error => console.error(JSON.stringify(error)))
