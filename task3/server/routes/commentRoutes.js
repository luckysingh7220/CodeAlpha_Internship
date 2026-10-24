const express = require('express');
const { getCommentsByTask, createComment } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createComment);

router.route('/task/:taskId')
  .get(protect, getCommentsByTask);

module.exports = router;
