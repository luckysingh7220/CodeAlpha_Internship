const Project = require('../models/Project');

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }]
    }).populate('owner', 'username email');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProject = async (req, res) => {
  const { title, description } = req.body;
  try {
    const project = new Project({
      title,
      description,
      owner: req.user._id,
      members: [req.user._id],
      columns: [
        { id: 'todo', title: 'To Do', taskIds: [] },
        { id: 'inProgress', title: 'In Progress', taskIds: [] },
        { id: 'done', title: 'Done', taskIds: [] }
      ]
    });
    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'username email')
      .populate('members', 'username email');
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBoardColumns = async (req, res) => {
  const { columns } = req.body;
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    
    project.columns = columns;
    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProjects, createProject, getProjectById, updateBoardColumns };
