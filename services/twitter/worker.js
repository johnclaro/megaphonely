const kue = require('kue')
const queue = kue.createQueue({
  prefix: 'q',
  redis: {
    port: 6379,
    host: 'redis'
  }
})

const service = require('service')

queue.process('twitter', (job, done) => {
  service.post(job.data)
})
