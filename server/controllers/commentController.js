const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Notification = require('../models/Notification');

// @desc    Get comments for a post
// @route   GET /api/comments/:postId
// @access  Public
const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .sort({ createdAt: -1 })
      .populate('author', 'name avatar');
    res.json(comments);
  } catch (err) {
    next(err);
  }
};

// @desc    Add comment to a post
// @route   POST /api/comments/:postId
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = await Comment.create({
      content: content.trim(),
      author: req.user.id,
      post: req.params.postId,
    });

    // Increment commentsCount on post
    await Post.findByIdAndUpdate(req.params.postId, {
      $inc: { commentsCount: 1 },
    });

    // Create notification for post author
    if (post.author.toString() !== req.user.id) {
      await Notification.create({
        recipient: post.author,
        sender: req.user.id,
        type: 'comment',
        post: post._id
      });
    }

    await comment.populate('author', 'name avatar');
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private (author only)
const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();

    // Decrement commentsCount on post
    await Post.findByIdAndUpdate(comment.post, {
      $inc: { commentsCount: -1 },
    });

    res.json({ message: 'Comment deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getComments, addComment, deleteComment };
