const express = require('express');
const router = express.Router();
const {
  createPost,
  getFeed,
  getExplore,
  getPost,
  updatePost,
  deletePost,
  likePost,
  addComment,
  deleteComment,
  getUserPosts,
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');

// Order matters — specific routes before parameterized
router.get('/feed', protect, getFeed);
router.get('/explore', getExplore);
router.get('/user/:userId', getUserPosts);

router.route('/').post(protect, createPost);

router.route('/:id').get(getPost).put(protect, updatePost).delete(protect, deletePost);

router.put('/:id/like', protect, likePost);
router.post('/:id/comment', protect, addComment);
router.delete('/:id/comment/:commentId', protect, deleteComment);

module.exports = router;
