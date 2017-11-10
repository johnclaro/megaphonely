const kue = require('kue')
const queue = kue.createQueue({redis: {host: process.env.REDIS_HOST}})

const service = require('service')

queue.process('facebook', (job, done) => {
  service.post(job.data, (err, data) => {
    if(err) console.error(err)
    console.log('Finished posting to facebook!')
    done()
  })
})
