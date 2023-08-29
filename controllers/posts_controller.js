const Post = require('../models/post');

// Assuming you have required the necessary modules and models

module.exports.create = async function (req, res) {
    try {
        const post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        // Post creation successful
        return res.redirect('back');
    } catch (err) {
        console.error("Error in creating a post:", err);
        // Handle the error appropriately
    }
}
