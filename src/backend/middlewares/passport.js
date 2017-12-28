'use strict';

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
  clientID: '131615980878062',
  clientSecret: '90b4b4bd780cd7ad9c7d493b0c3a1aeb',
  callbackURL: '/auth/facebook/callback',
  passReqToCallback: true
}, (req, accessToken, refreshToken, profile, done) => {
  console.log(req.cookies)
  return done(null, 'Done');
}));
