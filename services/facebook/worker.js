const kue = require('kue')
const queue = kue.createQueue({redis: {host: process.env.REDIS_HOST}})

const service = require('service')

queue.process('facebook', (job, done) => {
  service.post(job.data.message, job.data.file, job.data.socialId,
               job.data.accessToken, (err, data) => {
                 if(err) console.error(err)
                 console.log('Finished tweeting!')
                 done()
               })
})
