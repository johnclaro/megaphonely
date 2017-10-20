fs = require('fs')
fs.readFile('.env.example', 'utf8', (err, data) => {
  if(err) return console.err(err)
  var example = data.replace(/(\r\n|\n|\r)/gm,'') // Remove any linebreaks
  var example = example.split('=') // Split the string between =
  var example = example.filter((e) => {return e}) // Remove any empty items

  const expected = [
    'DB_NAME',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_HOST',
    'DB_DIALECT',
    'DB_STORAGE',
    'DB_LOGGING',
    'DB_SALT',
    'SECRET',
    'PORT',
    'EMAIL',
    'EMAIL_PASSWORD',
    'TWITTER_EMAIL',
    'TWITTER_PASSWORD',
    'TWITTER_CALLBACK_URL',
    'TWITTER_API_KEY',
    'TWITTER_API_SECRET',
    'FACEBOOK_EMAIL',
    'FACEBOOK_PASSWORD',
    'DOMAIN_NAM'
  ]
  console.log(example.length == expected.length)
  console.log(example.every((v, i) => v === expected[i]))
})
