const express = require('express');
const { body } = require('express-validator');
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getPostsByTag,
  getPostsByUser,
  toggleLike,
  toggleBookmark
} = require('../controllers/postController');
const { protect, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// IMPORTANT: specific routes must come before /:id
router.get('/tag/:tag', getPostsByTag);
router.get('/user/:userId', protect, getPostsByUser); // Using protect tentatively so req.user is available for draft checking, wait, if no token, auth middleware returns 401. Let's make a custom middleware or just let auth be optional.

// Let's modify the route to NOT use protect strictly if we want public access to user profiles.
// Actually, I'll just change getPostsByUser logic to handle missing req.user by not passing protect. Wait, without protect req.user is undefined, which is fine!
router.get('/user/:userId', optionalAuth, getPostsByUser);

router.post('/:id/like', protect, toggleLike);
router.post('/:id/bookmark', protect, toggleBookmark);

router.get('/', getPosts);
router.get('/:id', getPostById);

router.post(
  '/',
  protect,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
  ],
  createPost
);

router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;
