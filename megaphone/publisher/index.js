'use strict'

const provider = process.argv.slice(2)[0]

const fs = require('fs')

const kue = require('kue')
const isVideo = require('is-video')
const replaceExt = require('replace-ext')

const Schedule = require('models').Schedule
const service = require(`lib/${provider}`)

const queue = kue.createQueue({redis: {host: process.env.REDIS_HOST}})

queue.process(provider, (job, done) => {
  console.log(`Found a ${provider} job`)

  service.post(job.data, (err, data) => {
    Schedule.findOne({
      where: {content_id: job.data.contentId, social_id: job.data.socialId}
    })
    .then(schedule => {
      if(err) {
        console.log(`Failed to publish for ${provider}`)
        schedule.update({
          isSuccess: false,
          isPublished: true,
          statusCode: err.statusCode,
          statusMessage: err.statusMessage
        })
      } else {
        console.log(`Successfully posted to ${provider}`)
        schedule.update({
          isSuccess: true,
          isPublished: true,
          statusCode: 200,
          statusMessage: 'Success'
        })
      }
    })

    if(job.data.file) {
      const filename = `${provider}-${job.data.file.key}`
      if (isVideo(filename)) {
        const mp4 = replaceExt(filename, '.mp4')
        fs.unlink(mp4)
      } else {
        fs.unlink(filename)
      }
    }
    done()
  })
})
