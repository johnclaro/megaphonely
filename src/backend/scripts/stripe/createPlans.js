require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

stripe.plans.create({
  name: 'Standard',
  id: 'standard-monthly',
  interval: 'month',
  currency: 'eur',
  amount: 1500
}, (err, plan) => {
  console.error('Basic Error:', err)
  console.log('Basic Plan:', plan)
})
