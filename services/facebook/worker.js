const kue = require('kue')
const queue = kue.createQueue({redis: {host: process.env.REDIS_HOST}})

const service = require('service')

queue.process('facebook', (job, done) => {
  service.post(job.data)
})
