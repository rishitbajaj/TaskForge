const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { 
    type: String, 
    enum: ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'], 
    default: 'TODO' 
  },
  priority: { 
    type: String, 
    enum: ['LOW', 'MEDIUM', 'HIGH'], 
    default: 'MEDIUM' 
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dueDate: { type: Date }
}, { timestamps: true });

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tasks: [TaskSchema]
}, { timestamps: true });

ProjectSchema.index({ owner: 1 });
ProjectSchema.index({ 'tasks.status': 1 });

module.exports = mongoose.model('Project', ProjectSchema);