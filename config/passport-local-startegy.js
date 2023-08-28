const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');


// authentication using passport
// passport.use(new LocalStrategy({
//         usernameField: 'email'
//     },
//     async function(email, password, done){
//         // find a user and establish the identity
//        try{
//         const findingEmail= await User.findOne({email: email}, function(err, user)  {
//             if (err){
//                 console.log('Error in finding user --> Passport');
//                 return done(err);
//             }

//             if (!user || user.password != password){
//                 console.log('Invalid Username/Password');
//                 return done(null, false);
//             }

//             return done(null, user);
//         });
//        }catch{
//         console.log('nahi kuch yaha chutye ur dumb as fuck');
//        }
//     }


// ));

passport.use(new LocalStrategy({
    usernameField: 'email'
},
async function(email, password, done){
    try {
        // find a user and establish the identity
        const user = await User.findOne({ email: email });

        if (!user || user.password !== password) {
            console.log('Invalid Username/Password');
            return done(null, false);
        }

        return done(null, user);
    } catch (err) {
        console.log('Error in finding user --> Passport');
        return done(err);
    }
}));



// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});



// deserializing the user from the key in the cookies
passport.deserializeUser(async function(id, done) {
    try {
        const user = await User.findById(id);
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    } catch (err) {
        console.log('Error in finding user --> Passport');
        return done(err);
    }
});

// check authetication

passport.checkAuthentication = async function (req, res, next) {
    try {
        // Check if the user is signed in
        if (req.isAuthenticated()) {
            return next(); // User is authenticated, proceed to the next middleware/controller
        } else {
            // User is not signed in, redirect to the sign-in page
            return res.redirect('/users/sign-in');
        }
    } catch (error) {
        // Handle any errors that might occur
        console.error("Error in checkAuthentication:", error);
        return res.status(500).send("Internal Server Error");
    }
};

// Middleware to set authenticated user in locals for views
passport.setAuthenticatedUser = async function (req, res, next) {
    try {
        if (req.isAuthenticated()) {
            // req.user contains the current signed-in user from the session cookie
            // Set the user in res.locals to make it available for views
            res.locals.user = req.user;
        }
        next(); // Move to the next middleware/controller
    } catch (error) {
        // Handle any errors that might occur
        console.error("Error in setAuthenticatedUser:", error);
        return res.status(500).send("Internal Server Error");
    }
};

module.exports = passport;