const Post = require("../models/post");
const User = require("../models/user");

module.exports.home = async function (req, res) {
  try {
    // console.log(req.cookies);
    let posts = await Post.find({})
    .sort("-createdAt")
    .populate('user')
    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
    })
    const users = await User.find({}); 
    return res.render("home", {
      title: "Codeial | Home",
      posts: posts,
      all_users: users,
    });
  } catch (err) {
    console.log("Error in fetching posts from db");
    return res.status(500).send("Internal Server Error");
  }
};
