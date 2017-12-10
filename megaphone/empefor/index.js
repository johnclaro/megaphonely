const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')

const filePath = '/Users/johnclaro/Downloads/SampleVideo_1280x720_1mb.mp4'

ffmpeg(filePath)
  .videoCodec('libx264')
  .audioCodec('libmp3lame')
  .size('1280x1024')
  .on('error', function(err) {
    console.log('An error occurred: ' + err.message);
  })
  .on('end', function() {
    console.log('Processing finished !');
  })
  .save('light.mp4');
