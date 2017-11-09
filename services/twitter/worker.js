const kue = require('kue')
const queue = kue.createQueue()

const service = require('twitter')

queue.process('twitter', (job, done) => {
  service.post(job.data)
})
