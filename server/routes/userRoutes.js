const express = require('express');
const router = express.Router();
const {
  getUserById,
  updateProfile,
  followUser,
  getFollowers,
  getFollowing,
  searchUsers,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Search must come before /:id to avoid conflicts
router.get('/search', searchUsers);
router.put('/profile', protect, updateProfile);
router.get('/:id', getUserById);
router.put('/:id/follow', protect, followUser);
router.get('/:id/followers', getFollowers);
router.get('/:id/following', getFollowing);

module.exports = router;
