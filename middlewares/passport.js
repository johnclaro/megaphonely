const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const TwitterStrategy = require('passport-twitter').Strategy

const Account = require('models').Account
const TwitterAccount = require('models').TwitterAccount

passport.serializeUser((account, done) => {
  if(!account) return done(new Error(404))
  var today = new Date()
  account.update({lastLoginAt: today.setDate(today.getDate())})
  return done(null, account.id)
})

passport.deserializeUser((id, done) => {
  Account.findById(id)
  .then(account => {
    return done(null, account)
  })
  .catch(err => {
    return done(err)
  })
})

passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
  Account.findAccount(email, password)
  .then(account => {
    return done(null, account)
  })
  .catch(err => {
    return done(err, null)
  })
}))

passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: '/auth/twitter/callback',
    passReqToCallback: true
  }, (req, token, tokenSecret, profile, done) => {
    TwitterAccount.findOne(
      {
        where: {
          twitterId: profile.id,
          accountId: req.user.id
        }
      }
    )
    .then(twitterAccount => {
      if(!twitterAccount) {
        TwitterAccount.create({
            accountId: req.user.id,
            twitterId: profile.id,
            username: profile.username,
            displayName: profile.displayName,
            profilePicture: profile.photos[0].value,
            accessTokenKey: token,
            accessTokenSecret: tokenSecret,
            isConnected: true
        })
        .then(twitterAccount => {
          console.log('Created twitter account!')
          Account.findOne({where: {email: req.user.email}})
          .then(account => {
            return done(null, account)
          })
        })
        .catch(err => {
          console.error('Failed to create twitter account!')
          return done(err, null)
        })
      } else {
        // TODO: Only perform update when any fields are different from the
        // newly received data!
        twitterAccount.update({
            accountId: req.user.id,
            twitterId: profile.id,
            username: profile.username,
            displayName: profile.displayName,
            profilePicture: profile.photos[0].value,
            accessTokenKey: token,
            accessTokenSecret: tokenSecret,
            isConnected: true
        })
        .then(success => {
          console.log('Updated twitter account!')
          Account.findOne({where: {email: req.user.email}})
          .then(account => {
            return done(null, account)
          })
        })
        .catch(err => {
          console.error('Failed to udpate twitter account!')
          return done(err, null)
        })
      }
    })
    .catch(err => {
      console.error(`Twitter Auth Error: ${err}`)
    })
  }
))

exports.isAuthenticated = (req, res, next) => {
  if(req.isAuthenticated()) return next()
  req.flash('error', 'Please sign in or register to access this page.')
  res.redirect('/login?flash=Please sign in or register to access this page.')
}
