'use strict'

const fs = require('fs')

const kue = require('kue')

const Schedule = require('models').Schedule
const service = require('twitter/service')

const queue = kue.createQueue({redis: {host: process.env.REDIS_HOST}})

queue.process('twitter', (job, done) => {
  console.log(`Found a twitter job`)
  service.post(job.data, (err, data, file) => {
    Schedule.findOne({
      where: {content_id: job.data.contentId, social_id: job.data.socialId}
    })
    .then(schedule => {
      if(err) {
        console.log('Failed to post to Twitter')
        schedule.update({
          isSuccess: false,
          isPublished: true,
          statusCode: err.statusCode,
          statusMessage: err.message
        })
      } else {
        console.log('Successfully posted to Twitter')
        schedule.update({
          isSuccess: true,
          isPublished: true,
          statusCode: data.statusCode,
          statusMessage: data.headers.status
        })
      }
    })

    if(file) fs.unlink(file.path)
    done()
  })
})
