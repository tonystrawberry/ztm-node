const express = require('express');
const helmet = require('helmet');
const https = require('https');
const fs = require('fs');
const path = require('path');
const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');
const cookieSession = require('cookie-session');

require('dotenv').config();

const PORT = 3000;
const config = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  COOKIE_KEY_1: process.env.COOKIE_KEY_1,
  COOKIE_KEY_2: process.env.COOKIE_KEY_2,
}

function verifyCallback(accessToken, refreshToken, profile, done){
  console.log('Google profile', profile);
  done(null, profile);
}

passport.use(new Strategy({
  callbackURL: '/auth/google/callback',
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET
}, verifyCallback));

// Save the session to the cookie
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Read the session from the cookie
passport.deserializeUser((id , done) => {
  done(null, id);
});

const app = express();

app.use(helmet());
app.use(cookieSession({
  name: 'ztm-session',
  maxAge: 24 * 60 * 60 * 1000,
  keys: [ config.COOKIE_KEY_1, config.COOKIE_KEY_2 ]
}));
app.use(passport.initialize());
app.use(passport.session());

function checkLoggedIn(req, res, next) {
  console.log('Current user is:', req.user);
  console.log('req.isAuthenticated', req.isAuthenticated())
  const isLoggedIn = req.isAuthenticated() && req.user;
  if (!isLoggedIn) {
    return res.status(401).json({
      error: 'You must log in!',
    });
  }
  next();
}

app.get('/auth/google', passport.authenticate('google', {
  scope: ['email', 'profile']
}));

app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/failure',
    successRedirect: '/',
    session: true,
  }),
  (req, res) => {
    console.log('Google called us back');
  }
);

app.get('/auth/logout', (req, res) => {
  req.logout(); // removes req.user and clears any logged in session
  return res.redirect('/');
});

// checkLoggedIn middleware
app.get('/secret', checkLoggedIn, (req, res) => {
  return res.send('Your personal secret value is 1994!');
});

app.get('/failure', (req, res) => {
  return res.send('Fail to login!')
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

https.createServer({
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem'),
}, app).listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
