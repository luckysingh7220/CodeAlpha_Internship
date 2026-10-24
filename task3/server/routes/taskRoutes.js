const express = require('express');
const { getTasksByProject, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, createTask);

router.route('/project/:projectId')
  .get(protect, getTasksByProject);

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, deleteTask);

module.exports = router;
