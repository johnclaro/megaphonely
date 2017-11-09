const kue = require('kue')
const queue = kue.createQueue({redis: {host: process.env.REDIS_HOST}})

const service = require('service')

queue.process('twitter', (job, done) => {
  service.post(job.data)
})
