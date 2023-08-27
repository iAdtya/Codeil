const User = require('../models/user');

module.exports.profile = function(req,res){
     res.end('<h1>User Profile</h1>');
}

//todo render the sign up page
module.exports.signUp = function(req,res){
     return res.render('user_sign_up',{
          title:"Codeial | Sign In"
     });
}
//todo render the sign in page
module.exports.signIn = function(req,res){
     return res.render('user_sign_in',{
          title:"Codeial | Sign In"
     });
}

module.exports.create = async function(req, res) {
    try {
        if (req.body.password !== req.body.confirm_password) {
            return res.redirect('back');
        }

        const existingUser = await User.findOne({ email: req.body.email });
        

        if (!existingUser) {
            const newUser = new User(req.body);
            await newUser.save();
            console.log(existingUser);
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

}