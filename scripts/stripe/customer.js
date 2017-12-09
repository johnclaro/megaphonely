require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

stripe.customers.retrieve('cus_Bv1uNGmEdOQBjI', (err, data) => {
  console.log(JSON.stringify(data, null, 4))
})
