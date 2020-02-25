import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { UserSchema, IUser } from '../data-access/models/users';

const Users = mongoose.model('Users', UserSchema);

passport.use(
  new LocalStrategy(
    {
      usernameField: 'user[email]',
      passwordField: 'user[password]',
    },
    (email, password, done) => {
      Users.findOne({ email })
        .then((user: IUser) => {
          if (!user || !user.validatePassword(password)) {
            return done(null, false, {
              message: 'email or password is invalid',
            });
          }

          return done(null, user);
        })
        .catch(done);
    },
  ),
);
