const express = require('express');
const { getUserProfile, updateProfile, changePassword, toggleFollow, getAllUsers, deleteUser } = require('../controllers/userController');
const { protect, adminProtect } = require('../middleware/auth');

const router = express.Router();

// Admin-only: get all users
router.get('/', protect, adminProtect, getAllUsers);

// Admin-only: delete user
router.delete('/:id', protect, adminProtect, deleteUser);

router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.get('/:id', getUserProfile);
router.post('/:id/follow', protect, toggleFollow);

module.exports = router;
