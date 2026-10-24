const express = require('express');
const { getProjects, createProject, getProjectById, updateBoardColumns } = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getProjects)
  .post(protect, createProject);

router.route('/:id')
  .get(protect, getProjectById)
  .put(protect, updateBoardColumns);

module.exports = router;
