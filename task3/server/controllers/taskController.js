const Task = require('../models/Task');
const Project = require('../models/Project');

const getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId }).populate('assignedTo', 'username email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  const { title, description, projectId, columnId } = req.body;
  try {
    const task = new Task({ title, description, projectId, columnId });
    const createdTask = await task.save();
    
    const project = await Project.findById(projectId);
    const colIndex = project.columns.findIndex(col => col.id === columnId);
    if (colIndex > -1) {
      project.columns[colIndex].taskIds.push(createdTask._id);
      await project.save();
    }
    
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  const { title, description, columnId, assignedTo } = req.body;
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    task.title = title || task.title;
    task.description = description !== undefined ? description : task.description;
    task.columnId = columnId || task.columnId;
    task.assignedTo = assignedTo || task.assignedTo;
    
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    
    await Task.deleteOne({ _id: task._id });
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasksByProject, createTask, updateTask, deleteTask };
