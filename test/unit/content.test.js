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
    it.only('POST /login foobar', () => {
      return agent
      .post('/login')
      .send({email: 'foobar@gmail.com', password: 'p455w0rd'})
    })

    it.only('POST /content valid content', () => {
      var publishAt = new Date()
      publishAt.setSeconds(publishAt.getSeconds() + 1);

      return agent
        .post('/content')
        .send({message: 'foo', publishAt: publishAt, twitterUsernames: 'johnclaro3'})
        .expect('Location', '/dashboard?flash=Success')
    })

    it('POST /content invalid message', () => {
      app.request.isAuthenticated = () => {return true}
      return agent
        .post('/content')
        .send({message: ''})
        .expect('Location', '/dashboard?flash=Message%20cannot%20be%20empty')
    })

    it('POST /content no twitter account', () => {
      app.request.isAuthenticated = () => {return true}
      return agent
        .post('/content')
        .send({message: 'foo'})
        .expect('Location', '/dashboard?flash=You%20must%20choose%20a%20twitter%20account')
    })

    it('POST /content invalid publishAt', () => {
      app.request.isAuthenticated = () => {return true}
      return agent
        .post('/content')
        .send({message: 'foo', twitterUsernames: 'johnclaro3', publishAt: '2016-10-10T12:12'})
        .expect('Location', '/dashboard?flash=Cannot%20schedule%20in%20the%20past')
    })
  })
})
