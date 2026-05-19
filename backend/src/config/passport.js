const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User.model");

const googleOAuthConfigured =
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CALLBACK_URL;

const githubOAuthConfigured =
  process.env.GITHUB_CLIENT_ID &&
  process.env.GITHUB_CLIENT_SECRET &&
  process.env.GITHUB_CALLBACK_URL;

// ── Google Strategy ───────────────────────────────────────────────────────────
if (googleOAuthConfigured) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) return done(new Error("No email from Google"), null);

          // Check if user already exists with this email
          let user = await User.findOne({ email });

          if (user) {
            // Link Google account if not already linked
            if (!user.googleId) {
              user.googleId = profile.id;
              user.isEmailVerified = true;
              if (!user.avatar && profile.photos?.[0]?.value) {
                user.avatar = profile.photos[0].value;
              }
              await user.save({ validateBeforeSave: false });
            }
            return done(null, user);
          }

          // Create new user from Google profile
          user = await User.create({
            name: profile.displayName || email.split("@")[0],
            email,
            googleId: profile.id,
            avatar: profile.photos?.[0]?.value || "",
            isEmailVerified: true,
            role: "student",
            // Random password so the account can't be accessed via password login
            password: require("crypto").randomBytes(32).toString("hex"),
          });

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
}

// ── GitHub Strategy ───────────────────────────────────────────────────────────
if (githubOAuthConfigured) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email =
            profile.emails?.find((e) => e.primary)?.value ||
            profile.emails?.[0]?.value;

          if (!email) return done(new Error("No email from GitHub"), null);

          let user = await User.findOne({ email });

          if (user) {
            if (!user.githubId) {
              user.githubId = profile.id;
              user.isEmailVerified = true;
              if (!user.avatar && profile.photos?.[0]?.value) {
                user.avatar = profile.photos[0].value;
              }
              await user.save({ validateBeforeSave: false });
            }
            return done(null, user);
          }

          user = await User.create({
            name: profile.displayName || profile.username || email.split("@")[0],
            email,
            githubId: profile.id,
            avatar: profile.photos?.[0]?.value || "",
            isEmailVerified: true,
            role: "student",
            password: require("crypto").randomBytes(32).toString("hex"),
          });

          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
}

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;