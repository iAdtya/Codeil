const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");

const User = require("../models/user");

//todo tell passport to use a new strategy for google login

passport.use(
  new googleStrategy(
    {
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: "http://localhost:8000/users/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOne({ email: profile.emails[0].value }).exec();
        
        if (user) {
          console.log("User found:", profile);
          console.log(accessToken,refreshToken)

          return done(null, user);
        } else {
          const newUser = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: crypto.randomBytes(20).toString("hex"),
          });
          // console.log("New user created:", newUser);
          return done(null, newUser);
        }
      }
      catch (err) {
        console.log("Error in Google Strategy-passport:", err);
        return done(err, null);
      }
    }
  )
);

