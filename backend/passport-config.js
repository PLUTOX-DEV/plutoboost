import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from './models/User.js';

export default function(passport) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || "/auth/google/callback",
    proxy: true
  },
  async (accessToken, refreshToken, profile, done) => {
    const newUser = {
      googleId: profile.id,
      username: profile.displayName,
      email: profile.emails[0].value,
    };
    try {
      let user = await User.findOne({ googleId: profile.id });
      if (user) {
        done(null, user);
      } else {
        user = await User.create(newUser);
        done(null, user);
      }
    } catch (err) {
      console.error(err);
    }
  }));

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
}