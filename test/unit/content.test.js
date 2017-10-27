const request = require('supertest')
const expect = require('chai').expect

const app = require('app.js')
const Account = require('models').Account
const TwitterAccount = require('models').TwitterAccount
const Content = require('models').Content

const agent = request.agent(app)

describe('contents', () => {

  before(() => {
    return Promise.all(
      [
        Account.sync({force: true}),
        TwitterAccount.sync({force: true}),
        Content.sync({force:true})
      ]
    )
    .then(success => {
      Account.create({firstName: 'Foo', lastName: 'Bar', email: 'foobar@gmail.com', password: 'p455w0rd'})

      TwitterAccount.create({
        accountId: 1,
        twitterUsername: '901476753272655872',
        username: 'johnclaro3',
        displayName: 'John Claro',
        profilePicture: 'https://pbs.twimg.com/profile_images/923214026250899456/hVlVVOtC_normal.jpg',
        accessTokenKey: '901476753272655872-kJ82EuZD9h1fdtORaL5IOxEnPQPHxJw',
        accessTokenSecret: 'LIqmsCjFcGAbfUwSHqUELPWxPrtTJExR5lkS3JALovFWX',
        isConnected: true
      })
    })
  })

  after(() => {
    return Promise.all(
      [
        Account.destroy({truncate: true}),
        TwitterAccount.destroy({truncate: true})
      ]
    )
  })

  describe('controllers', () => {
    it('POST /login foobar', () => {
      return agent
        .post('/login')
        .send({email: 'foobar@gmail.com', password: 'p455w0rd'})
    })

    it('POST /content valid content', () => {
      var publishAt = new Date()
      publishAt.setSeconds(publishAt.getSeconds() + 1);

      return agent
        .post('/content')
        .send({message: 'foo', publishAt: publishAt, twitterUsernames: 'johnclaro3'})
        .expect('Location', '/dashboard')
        .expect('flash-message', 'Succesfully scheduled twitter contents')
    })

    it('POST /content invalid message', () => {
      return agent
        .post('/content')
        .send({message: ''})
        .expect('Location', '/dashboard')
        .expect('flash-message', 'Message cannot be empty')
    })

    it('POST /content no twitter account', () => {
      return agent
        .post('/content')
        .send({message: 'foo'})
        .expect('Location', '/dashboard')
        .expect('flash-message', 'You must choose a twitter account')
    })

    it('POST /content invalid publishAt', () => {
      return agent
        .post('/content')
        .send({message: 'foo', twitterUsernames: 'johnclaro3', publishAt: '2016-10-10T12:12'})
        .expect('Location', '/dashboard')
        .expect('flash-message', 'Cannot schedule in the past')
    })
  })
})
