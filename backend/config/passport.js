import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.model.js';
import { Op } from 'sequelize';

export const configurePassport = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`,
        scope: ['profile', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ where: { googleId: profile.id } });
          
          if (user) {
            return done(null, user);
          }
          
          user = await User.findOne({ where: { email: profile.emails[0].value } });
          
          if (user) {
            user.googleId = profile.id;
            user.provider = 'google';
            user.avatar = profile.photos[0]?.value || null;
            user.isEmailVerified = true;
            await user.save();
            return done(null, user);
          }
          
          const username = profile.emails[0].value.split('@')[0] + 
                          Math.floor(Math.random() * 1000);
          
          user = await User.create({
            fullName: profile.displayName,
            username: username,
            email: profile.emails[0].value,
            googleId: profile.id,
            provider: 'google',
            avatar: profile.photos[0]?.value || null,
            isEmailVerified: true,
            password: null
          });
          
          return done(null, user);
        } catch (error) {
          console.error('Google OAuth error:', error);
          return done(error, null);
        }
      }
    )
  );
};

export default configurePassport;