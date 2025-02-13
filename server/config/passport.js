const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt');

const config = require('./config');
const User = require('../models/user.model');
const localLogin = new LocalStrategy(
  {
    usernameField: 'email',
  },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return done(null, false, {
          error: 'Your login details could not be verified. Please try again.',
        });
      }

      const isValidPassword = await bcrypt.compare(
        password,
        user.hashedPassword
      );
      if (!isValidPassword) {
        return done(null, false, {
          error: 'Your login details could not be verified. Please try again.',
        });
      }

      const userObject = user.get({ plain: true });
      delete userObject.hashedPassword;

      done(null, userObject);
    } catch (error) {
      done(error);
    }
  }
);

const jwtLogin = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtSecret,
  },
  async (payload, done) => {
    try {
      // Buscar el usuario por ID
      const user = await User.findByPk(payload.id);
      if (!user) {
        return done(null, false);
      }

      const userObject = user.get({ plain: true });
      delete userObject.hashedPassword;

      // Devolver el usuario
      done(null, userObject);
    } catch (error) {
      done(error);
    }
  }
);

passport.use(jwtLogin);
passport.use(localLogin);

module.exports = passport;
