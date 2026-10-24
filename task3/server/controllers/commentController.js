const Comment = require('../models/Comment');

const getCommentsByTask = async (req, res) => {
  try {
    const comments = await Comment.find({ taskId: req.params.taskId })
      .populate('author', 'username email')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createComment = async (req, res) => {
  const { text, taskId } = req.body;
  try {
    const comment = new Comment({
      text,
      taskId,
      author: req.user._id
    });
    let createdComment = await comment.save();
    createdComment = await createdComment.populate('author', 'username email');
    res.status(201).json(createdComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCommentsByTask, createComment };
