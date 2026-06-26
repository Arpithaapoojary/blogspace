const User = require('../models/User');
const Post = require('../models/Post');
const Notification = require('../models/Notification');
const Comment = require('../models/Comment');
const bcrypt = require('bcryptjs');

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('followers', 'name avatar bio')
      .populate('following', 'name avatar bio');
      
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const postCount = await Post.countDocuments({ author: req.params.id, status: 'published' });
    res.json({ ...user.toObject(), postCount });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (err) {
    next(err);
  }
};

// @desc    Update logged-in user's profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, avatar } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;

    const updated = await user.save();
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      bio: updated.bio,
      avatar: updated.avatar,
      role: updated.role,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Change password
// @route   PUT /api/users/password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle Follow/Unfollow User
// @route   POST /api/users/:id/follow
// @access  Private
const toggleFollow = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user.id;

    if (targetUserId === currentUserId) {
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const targetUser = await User.findById(targetUserId);
    const currentUser = await User.findById(currentUserId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      currentUser.following.pull(targetUserId);
      targetUser.followers.pull(currentUserId);
    } else {
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);

      // Create notification for target user
      await Notification.create({
        recipient: targetUserId,
        sender: currentUserId,
        type: 'follow',
      });
    }

    await currentUser.save();
    await targetUser.save();

    res.json({ following: currentUser.following, followers: targetUser.followers, isFollowing: !isFollowing });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res, next) => {
  try {
    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (userToDelete.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete an admin user' });
    }

    // Cascading deletes
    // 1. Delete all posts by this user
    await Post.deleteMany({ author: req.params.id });

    // 2. Delete all comments by this user
    await Comment.deleteMany({ author: req.params.id });

    // 3. Delete all notifications sent by or to this user
    await Notification.deleteMany({
      $or: [{ recipient: req.params.id }, { sender: req.params.id }]
    });

    // 4. Remove this user from everyone's followers/following lists
    await User.updateMany(
      { following: req.params.id },
      { $pull: { following: req.params.id } }
    );
    await User.updateMany(
      { followers: req.params.id },
      { $pull: { followers: req.params.id } }
    );
    
    // 5. Remove bookmarks
    await User.updateMany(
      { bookmarks: { $in: await Post.find({ author: req.params.id }).distinct('_id') } },
      { $pull: { bookmarks: { $in: await Post.find({ author: req.params.id }).distinct('_id') } } }
    );

    await userToDelete.deleteOne();

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUserProfile, updateProfile, changePassword, toggleFollow, getAllUsers, deleteUser };
