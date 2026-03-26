import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.model.js';

export const configurePassport = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Google OAuth Strategy
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
          console.log('Google profile:', profile);
          
          // Check if user already exists with googleId
          let user = await User.findOne({ googleId: profile.id });
          
          if (user) {
            // User exists with Google ID
            return done(null, user);
          }
          
          // Check if user exists with same email
          user = await User.findOne({ email: profile.emails[0].value });
          
          if (user) {
            // User exists with email but not Google ID - link accounts
            user.googleId = profile.id;
            user.provider = 'google';
            user.avatar = profile.photos[0]?.value || null;
            user.isEmailVerified = true; // Google emails are verified
            await user.save();
            return done(null, user);
          }
          
          // Create new user
          const username = profile.emails[0].value.split('@')[0] + 
                          Math.floor(Math.random() * 1000);
          
          user = await User.create({
            fullName: profile.displayName,
            username: username,
            email: profile.emails[0].value,
            googleId: profile.id,
            provider: 'google',
            avatar: profile.photos[0]?.value || null,
            isEmailVerified: true, // Google emails are verified
            password: null, // No password for OAuth users
            location: '',
            birthDate: null
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