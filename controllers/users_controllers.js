const User = require('../models/user');

module.exports.profile = function(req,res){
    return res.render('user_profile', {
        title: 'User Profile'
    })
}

module.exports.signUp = async function (req, res) {
    try {
        if (req.isAuthenticated()) {
            return res.redirect('/users/profile');
        }

        // Render the sign-up page
        return res.render('user_sign_up', {
            title: "Codeial | Sign up"
        });
    } catch (error) {
        console.error("Error in signUp controller:", error);
        return res.status(500).send("Internal Server Error");
    }
};

// Controller to render the sign-in page
module.exports.signIn = async function (req, res) {
    try {
        if (req.isAuthenticated()) {
            return res.redirect('/users/profile');
        }

        // Render the sign-in page
        return res.render('user_sign_in', {
            title: "Codeial | Sign In"
        });
    } catch (error) {
        console.error("Error in signIn controller:", error);
        return res.status(500).send("Internal Server Error");
    }
};

module.exports.create = async function(req, res) {
    console.log(req.body);
    try {
        if (req.body.password !== req.body.confirm_password) {
            return res.redirect('back');
        }

        const existingUser = await User.findOne({ email: req.body.email });
        

        if (!existingUser) {
            const newUser = new User(req.body);
            await newUser.save();
            // console.log(existingUser);
            return res.redirect('/users/sign-in');
        } else {
            return res.redirect('back');
        }
    } catch (err) {
        console.log('Error in signing up:', err);
        return res.status(500).send('Internal Server Error');
    }
};


module.exports.createSession = function(req,res){
    return res.redirect('/');
}

module.exports.destroySession = function(req, res) {
    req.logout(function(err) {
        if (err) {
            console.error('Error during logout:', err);
            return res.redirect('/');
        }
        
        return res.redirect('/');
    });
};
