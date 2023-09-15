const User = require("../models/user");
const fs = require("fs");
const path = require("path");


module.exports.profile = async function (req, res) {
  const users = await User.findById(req.params.id);
  return res.render("user_profile", {
    title: "User Profile",
    profile_user: users,
  });
};

//? req.body can be return as an object { name: req.body.name, email: req.body.email, password: req.body.password } but
//? req.body contains everything so we can directly use req.body
module.exports.update = async (req, res) => {
  // if (req.user.id == req.params.id) {
  //   User.findByIdAndUpdate(req.params.id, req.body, (err, user) => {
  //     return res.redirect("back");
  //   });
  // } else {
  //   return res.status(401).send("Unauthorized");
  // }

  if (req.user.id == req.params.id) {
    try {

      let user = await User.findById(req.params.id);
      User.uploadedAvatar(req, res, function (err) {

        if(err){
          console.log("*************Multer Error:", err);
        }

        console.log(req.file);
        
        user.name = req.body.name;
        user.email = req.body.email;
        
        if(req.file){

          if(user.avatar){
              fs.unlinkSync(path.join(__dirname, "..", user.avatar));
              
          }

          user.avatar = User.avatarPath + "/" + req.file.filename;  

        }
        user.save();
        return res.redirect("back");
      });
    }catch (err) {
      req.flash("error", err);
      // console.error("Error in update controller:", err);
      return res.status(500).send("Internal Server Error");
    }
  } else {
    req.flash("error", "Unauthorized");
    return res.status(401).send("Unauthorized");
  }
};

module.exports.signUp = async function (req, res) {
  try {
    if (req.isAuthenticated()) {
      return res.redirect("/users/profile");
    }

    // Render the sign-up page
    return res.render("user_sign_up", {
      title: "Codeial | Sign up",
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
      return res.redirect("/users/profile");
    }

    // Render the sign-in page
    return res.render("user_sign_in", {
      title: "Codeial | Sign In",
    });
  } catch (error) {
    console.error("Error in signIn controller:", error);
    return res.status(500).send("Internal Server Error");
  }
};

module.exports.create = async function (req, res) {
  console.log(req.body);
  try {
    if (req.body.password !== req.body.confirm_password) {
      return res.redirect("back");
    }

    const existingUser = await User.findOne({ email: req.body.email });

    if (!existingUser) {
      const newUser = new User(req.body);
      await newUser.save();
      // console.log(existingUser);
      return res.redirect("/users/sign-in");
    } else {
      return res.redirect("back");
    }
  } catch (err) {
    console.log("Error in signing up:", err);
    return res.status(500).send("Internal Server Error");
  }
};

module.exports.createSession = function (req, res) {
  req.flash("success", "Logged in successfully");
  return res.redirect("/");
};

module.exports.destroySession = function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.error("Error during logout:", err);
      return res.redirect("/");
    }
    req.flash("success", "Logged out successfully");
    return res.redirect("/");
  });
};
