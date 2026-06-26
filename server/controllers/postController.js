const { validationResult } = require('express-validator');
const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Get all posts (with search, sort, pagination)
// @route   GET /api/posts
// @access  Public
const getPosts = async (req, res, next) => {
  try {
    const { search, sort, status = 'published', page = 1, limit = 9 } = req.query;
    const query = { status };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const sortOptions =
      sort === 'comments' ? { commentsCount: -1 } : sort === 'likes' ? { likes: -1 } : sort === 'views' ? { views: -1 } : { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);

    const [posts, total] = await Promise.all([
      Post.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit))
        .populate('author', 'name avatar'),
      Post.countDocuments(query),
    ]);

    res.json({
      posts,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Public
const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      'author',
      'name avatar bio'
    );
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Increment view count
    post.views += 1;
    await post.save();

    res.json(post);
  } catch (err) {
    next(err);
  }
};

// @desc    Get feed (posts from followed users)
// @route   GET /api/posts/feed
// @access  Private
const getFeed = async (req, res, next) => {
  try {
    const { page = 1, limit = 9 } = req.query;
    const currentUser = await User.findById(req.user.id);
    
    if (!currentUser) return res.status(404).json({ message: 'User not found' });

    const query = {
      author: { $in: currentUser.following },
      status: 'published'
    };

    const skip = (Number(page) - 1) * Number(limit);

    const [posts, total] = await Promise.all([
      Post.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('author', 'name avatar'),
      Post.countDocuments(query),
    ]);

    res.json({
      posts,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, coverImage, tags, category, status } = req.body;

    const post = await Post.create({
      title,
      content,
      coverImage,
      tags: tags || [],
      category,
      status: status || 'published',
      author: req.user.id,
    });

    await post.populate('author', 'name avatar');
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private (author only)
const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    }

    const { title, content, coverImage, tags, category, status } = req.body;

    post.title = title || post.title;
    post.content = content || post.content;
    post.coverImage = coverImage !== undefined ? coverImage : post.coverImage;
    post.tags = tags || post.tags;
    post.category = category || post.category;
    if (status) post.status = status;

    const updated = await post.save();
    await updated.populate('author', 'name avatar');
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private (author only)
const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await post.deleteOne();

    // Also delete associated comments
    const Comment = require('../models/Comment');
    await Comment.deleteMany({ post: req.params.id });

    // Clean up bookmarks from users
    await User.updateMany(
      { bookmarks: req.params.id },
      { $pull: { bookmarks: req.params.id } }
    );

    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// @desc    Get posts by tag
// @route   GET /api/posts/tag/:tag
// @access  Public
const getPostsByTag = async (req, res, next) => {
  try {
    const { page = 1, limit = 9 } = req.query;
    const tag = req.params.tag.toLowerCase();
    const skip = (Number(page) - 1) * Number(limit);

    const [posts, total] = await Promise.all([
      Post.find({ tags: tag, status: 'published' })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('author', 'name avatar'),
      Post.countDocuments({ tags: tag, status: 'published' }),
    ]);

    res.json({
      posts,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get posts by user
// @route   GET /api/posts/user/:userId
// @access  Public
const getPostsByUser = async (req, res, next) => {
  try {
    const query = { author: req.params.userId };
    // Only show published if requesting another user's profile
    if (!req.user || req.user.id !== req.params.userId) {
      query.status = 'published';
    } else if (req.query.status) {
      query.status = req.query.status;
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .populate('author', 'name avatar');
    res.json(posts);
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle Like on Post
// @route   POST /api/posts/:id/like
// @access  Private
const toggleLike = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isLiked = post.likes.includes(req.user.id);
    
    if (isLiked) {
      post.likes.pull(req.user.id);
    } else {
      post.likes.push(req.user.id);
      
      // Create notification
      if (post.author.toString() !== req.user.id) {
        await Notification.create({
          recipient: post.author,
          sender: req.user.id,
          type: 'like',
          post: post._id
        });
      }
    }
    
    await post.save();
    res.json({ likes: post.likes, isLiked: !isLiked });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle Bookmark on Post
// @route   POST /api/posts/:id/bookmark
// @access  Private
const toggleBookmark = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isBookmarked = user.bookmarks.includes(req.params.id);
    
    if (isBookmarked) {
      user.bookmarks.pull(req.params.id);
    } else {
      user.bookmarks.push(req.params.id);
    }
    
    await user.save();
    res.json({ bookmarks: user.bookmarks, isBookmarked: !isBookmarked });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostsByTag,
  getPostsByUser,
  getFeed,
  toggleLike,
  toggleBookmark
};
