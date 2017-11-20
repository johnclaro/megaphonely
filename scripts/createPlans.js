require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

stripe.plans.create({
  name: 'Basic Plan',
  id: 'basic-monthly',
  interval: 'month',
  currency: 'eur',
  amount: 1000
}, (err, plan) => {
  console.error('Basic Error:', err)
  console.log('Basic Plan:', plan)
})

stripe.plans.create({
  name: 'Standard Plan',
  id: 'standard-monthly',
  interval: 'month',
  currency: 'eur',
  amount: 2000
}, (err, plan) => {
  console.error('Standard Error:', err)
  console.log('Standard Plan:', plan)
})
