const express = require('express');

const bcrypt = require('bcryptjs');

const User = require('../models/user');
const routeAuthGuard = require('./../middleware/route-auth-guard');

const authRouter = new express.Router();

authRouter.get('/sign-up', (request, response, next) => {
  response.render('auth/sign-up');
});

authRouter.post('/sign-up', (request, response, next) => {
  const { username, password } = request.body;

  bcrypt
    .hash(password, 10)
    .then(hashAndSalt => {
      return User.create({
        username,
        passwordHashAndSalt: hashAndSalt
      });
    })
    .then(user => {
      request.session.userId = user._id;
      response.redirect('/');
    })
    .catch(error => {
      next(error);
    });
});

authRouter.get('/sign-in', (request, response, next) => {
  response.render('auth/sign-in');
});

authRouter.post('/sign-in', (request, response, next) => {
  const { username, password } = request.body;

  let user;

  User.findOne({ username })
    .then(document => {
      user = document;
      if (!user) {
        return Promise.reject(new Error('No user with that username.'));
      }
      const passwordHashAndSalt = user.passwordHashAndSalt;
      return bcrypt.compare(password, passwordHashAndSalt);
    })
    .then(comparison => {
      if (comparison) {
        request.session.userId = user._id;
        response.redirect('/');
      } else {
        // User email and password are wrong.
        const error = new Error('Password did not match.');
        // Handle error in catch block instead of in next line
        // next(error);
        return Promise.reject(error);
      }
    })
    .catch(error => {
      // next(error);
      response.render('auth/sign-in', { error: error });
    });
});

authRouter.get('/private', routeAuthGuard, (request, response, next) => {
  response.render('private');
});

authRouter.get('/profile', routeAuthGuard, (request, response, next) => {
  response.render('profile');
});

module.exports = authRouter;
