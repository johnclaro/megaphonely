const kue = require('kue')
const queue = kue.createQueue({redis: {host: process.env.REDIS_HOST}})

const service = require('service')

queue.process('twitter', (job, done) => {
  service.post(job.data.message, job.data.file, job.data.accessTokenKey,
               job.data.accessTokenSecret, job.data.consumerKey,
               job.data.consumerSecret, (err, data) => {
                 if(err) console.error(err)
                 console.log('Finished tweeting!')
                 done()
               })
})
