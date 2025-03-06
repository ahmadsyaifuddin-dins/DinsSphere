const mongoose = require('mongoose');

const ViewSchema = new mongoose.Schema({
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  count: {
    type: Number,
    default: 0
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  },
  uniqueIPs: [String] 
});

module.exports = mongoose.model('ViewTasks', ViewSchema);