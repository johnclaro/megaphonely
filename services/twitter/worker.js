const kue = require('kue')
const queue = kue.createQueue()

const service = require('service')

queue.process('twitter', (job, done) => {
  service.post(job.data)
})
