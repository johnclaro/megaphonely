const request = require('supertest')
const expect = require('chai').expect

const app = require('app.js')
const Account = require('models').Account
const Social = require('models').Social
const Content = require('models').Content
const Schedule = require('models').Schedule
const models = require('models')

const agent = request.agent(app)

describe('contents', () => {

  before(() => {
    return models.sequelize.sync({force:true})
    .then(success => {
      Account.create({firstName: 'Foo', lastName: 'Bar', email: 'foobar@gmail.com', password: 'p455w0rd'})

      Social.create({
        accountId: 1,
        profileId: '901476753272655872',
        username: 'johnclaro3',
        displayName: 'John Claro',
        provider: 'twitter',
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
        Social.destroy({truncate: true})
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
      const payload = {
        message: 'foo',
        publishAt: 'Schedule Now',
        profileIds: '901476753272655872'
      }
      return agent
        .post('/content')
        .send(payload)
        .expect('Location', '/dashboard')
        .expect('flash-message', `Succesfully scheduled content`)
    })

    it('POST /content invalid message', () => {
      return agent
        .post('/content')
        .send({message: ''})
        .expect('Location', '/dashboard')
        .expect('flash-message', 'Message cannot be empty')
    })

    it('POST /content no social account chosen', () => {
      return agent
        .post('/content')
        .send({message: 'foo'})
        .expect('Location', '/dashboard')
        .expect('flash-message', 'You must choose a social account')
    })

    it('POST /content invalid publishAt', () => {
      const payload = {
        message: 'foo',
        profileIds: '901476753272655872',
        publishAt: '2016-10-10T12:12'
      }
      return agent
        .post('/content')
        .send(payload)
        .expect('Location', '/dashboard')
        .expect('flash-message', 'Cannot schedule in the past')
    })
  })
})
