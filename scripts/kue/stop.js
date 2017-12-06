const kue = require('kue')
const queue = kue.createQueue({redis: {host: process.env.REDIS_HOST}})

console.log('Telling all workers to stop processing...')
queue.shutdown((err) => {
  console.log('All workers are done! Have fun deploying! C:')
  process.exit(0)
})
