const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  taskIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  columns: [columnSchema] // order of columns matters for the board
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
