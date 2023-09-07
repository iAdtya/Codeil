const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function(req, res) {
  try {
    const posting = await Post.findById(req.body.post); // Find the post using the CommentSkeleton model
    if (posting) {
      const createdComment = await Comment.create({  // Use the Comment model to create a new comment
        content: req.body.content,
        post: req.body.post,
        user: req.user._id,
      });

      post.comments.push(createdComment._id); // Add the comment's ID to the post's comments array
      await post.save(); // Save the updated post

      res.redirect('/');
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (err) {
    console.log('Error in creating comment:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.destroy = async function(req, res) {

  try {
    const comment = await Comment.findById(req.params.id); // Find the comment using the Comment model
    if (comment) {
      if (comment.user == req.user.id) { // Check if the user attempting to delete the comment is the author of the comment
        const postId = comment.post; // Store the post ID of the comment before deleting it
        comment.deleteOne(); // Delete the comment

        // Pull the comment's ID from the post's comments array
        const post = await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });
        res.redirect('back');
      } else {
        res.status(401).json({ message: 'Unauthorized' });
      }
    } else {
      res.status(404).json({ message: 'Comment not found' });
    }
  } catch (err) {
    console.log('Error in deleting comment:', err);
    res.status(500).json({ message: 'Internal server error' });
  }

};