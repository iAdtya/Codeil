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
// if (req.user.id == req.params.id) {
//   User.findByIdAndUpdate(req.params.id, req.body, (err, user) => {
//     return res.redirect("back");
//   });
// } else {
//   return res.status(401).send("Unauthorized");
// }
module.exports.update = async (req, res) => {
  if (req.user.id == req.params.id) {
    try {
      // Find the user by ID
      let user = await User.findById(req.params.id);

      // Handle file upload using Multer
      User.uploadedAvatar(req, res, async function (err) {
        if (err) {
          console.log("*************Multer Error:", err);
        }

        // Log the uploaded file information
        console.log(req.file);

        // Update user data
        user.name = req.body.name;
        user.email = req.body.email;

        if (req.file) {
          if (user.avatar) {
            // Construct the old avatar file path based on the user's existing avatar filename
            const oldAvatarPath = path.join(__dirname, "..", user.avatar);

            // Check if the old avatar file exists before attempting to unlink it
            if (fs.existsSync(oldAvatarPath)) {
              fs.unlinkSync(oldAvatarPath);
            } else {
              console.log("Old avatar file does not exist:", oldAvatarPath);
            }
          }

          // Generate a new filename for the avatar
          const newAvatarFilename = `avatar-${req.user.id}-${Date.now()}.jpg`;

          // Construct the new avatar file path
          const newAvatarPath = path.join(__dirname, "..", User.avatarPath, newAvatarFilename);

          // Rename the uploaded file to the new filename
          fs.renameSync(req.file.path, newAvatarPath);

          // Update the user's avatar with the new filename
          user.avatar = User.avatarPath + "/" + newAvatarFilename;
        }

        try {
          // Save the updated user data
          await user.save();
          return res.redirect("back");
        } catch (saveErr) {
          console.error("Error saving user data:", saveErr);
          req.flash("error", "Error saving user data.");
          return res.status(500).send("Internal Server Error");
        }
      });
    } catch (findErr) {
      console.error("Error finding user by ID:", findErr);
      req.flash("error", "Error finding user.");
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

