const Post = require('../models/post');
const Comment = require('../models/comment');   

// Assuming you have required the necessary modules and models

module.exports.create = async function (req, res) {
    try {
        const post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        // todo Check if the request is an AJAX request
        if(req.xhr){
            return res.status(200).json({
                data:{
                    post:post
                },
                message:"Post created!"
            })
        }

        req.flash('success','Post published')
        //? Post creation successful
        return res.redirect('back');
    } catch (err) {
        // console.error("Error in creating a post:", err);
        req.flash('error',err)
        // ?Handle the error appropriately
    }
}

module.exports.comment = async function (req, res) {
    try { 
        const posts = await Comment.create({
            content: req.body.content,
            user: req.user._id,
        });
        return res.redirect('back');
      }
    catch (err) {
        console.error("Error in creating a comment:", err);
        // Handle the error appropriately
    }
}

module.exports.destroy = async function (req, res) {
    try {
        // Use `await` with `Post.findById` to retrieve the post
        const post = await Post.findById(req.params.id);

        // Check if the user attempting to delete the post is the author of the post
        if (post.user == req.user.id) {
            // Use `await` with `post.remove` to delete the post
            await post.deleteOne();

            if(req.xhr){
                return res.status(200).json({
                    data:{
                        post_id:req.params.id
                    },
                    message:"Post deleted"
                });
            }

            // Use `await` with `Comment.deleteMany` to remove associated comments
            await Comment.deleteMany({ post: req.params.id });
            req.flash('success','Post and associated comments deleted')

            // Redirect back to the previous page (assuming you're using Express)
            return res.redirect('back');
        } else {
            req.flash('error','You cannot delete this post')
            // If the user is not the author of the post, also redirect back to the previous page
            return res.redirect('back');
        }
    } catch (err) {
        // console.error("Error in deleting a post:", err);
        req.flash('error',err)
        // Handle the error appropriately, e.g., by sending an error response
        res.status(500).send("Error deleting the post.");
    }
}