const Comment = require("../models/comment");
const Post = require("../models/post");
const commentsMailer = require("../mailers/comments_mailer");

module.exports.create = async function (req, res) {
  try {
    const posting = await Post.findById(req.body.post); // Find the post using the CommentSkeleton model
    if (posting) {
      const createdComment = await Comment.create({
        // Use the Comment model to create a new comment
        content: req.body.content,
        post: req.body.post,
        user: req.user._id,
      });

      posting.comments.push(createdComment); // Add the comment's ID to the post's comments array
      posting.save(); // Save the updated post

      // createdComment = await createdComment.populate("user", "name email");

      // if (req.xhr) {
      //   return res.status(200).json({
      //     data: {
      //       comment: createdComment,
      //     },
      //     message: "Post created!",
      //   });
      // }

      req.flash("success", "Comment published!");
      res.redirect("/");
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  } catch (err) {
    console.log("Error in creating comment:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.destroy = async function (req, res) {
  try {
    const comment = await Comment.findById(req.params.id); // Find the comment using the Comment model
    if (comment) {
      if (comment.user == req.user.id) {
        // Check if the user attempting to delete the comment is the author of the comment
        const postId = comment.post; // Store the post ID of the comment before deleting it
        await comment.deleteOne({ _id: comment._id }); // Delete the comment

        // Pull the comment's ID from the post's comments array
        const post = await Post.findByIdAndUpdate(postId, {
          $pull: { comments: req.params.id },
        });

        // await Like.deleteMany({ likeable: comment._id, onModel: "Comment" });

        // if (req.xhr) {
        //   return res.status(200).json({
        //     data: {
        //       comment_id: req.params.id,
        //     },
        //     message: "Post deleted",
        //   });
        // }

        req.flash("success", "Comment deleted!");
        res.redirect("back");
      }
    } else {
      req.flash("error", "Unauthorized");
      res.status(404).json({ message: "Comment not found" });
    }
  } catch (err) {
    req.flash("error", err);
    console.log("Error in deleting comment:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
