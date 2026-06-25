const express = require('express');
const { getUserProfile, updateProfile, changePassword } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.get('/:id', getUserProfile);

module.exports = router;
