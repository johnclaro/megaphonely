// const fs = require('fs')
// const expect = require('chai').expect
//
// const expected = [
//   'DB_NAME',
//   'DB_USERNAME',
//   'DB_PASSWORD',
//   'DB_HOST',
//   'DB_DIALECT',
//   'DB_STORAGE',
//   'DB_LOGGING',
//   'DB_SALT',
//   'SECRET',
//   'PORT',
//   'EMAIL',
//   'EMAIL_PASSWORD',
//   'TWITTER_EMAIL',
//   'TWITTER_PASSWORD',
//   'TWITTER_CALLBACK_URL',
//   'TWITTER_API_KEY',
//   'TWITTER_API_SECRET',
//   'FACEBOOK_EMAIL',
//   'FACEBOOK_PASSWORD',
//   'DOMAIN_NAME'
// ]
//
// describe('.env.example', () => {
//   it('should have the same length', () => {
//     fs.readFile('.env.example', 'utf8', (err, data) => {
//       if(err) return console.err(err)
//       var example = data.replace(/(\r\n|\n|\r)/gm,'') // Remove any linebreaks
//       var example = example.split('=') // Split the string between =
//       var example = example.filter((e) => {return e}) // Remove any empty items
//
//       expect(example.length).to.be.equal(expected.length)
//     })
//   })
//
//   it('should have the same items', () => {
//     fs.readFile('.env.example', 'utf8', (err, data) => {
//       if(err) return console.err(err)
//       var example = data.replace(/(\r\n|\n|\r)/gm,'') // Remove any linebreaks
//       var example = example.split('=') // Split the string between =
//       var example = example.filter((e) => {return e}) // Remove any empty items
//       return expect(example.every((v, i) => v === expected[i])).to.be.true
//     })
//   })
// })
