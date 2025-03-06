const mongoose = require('mongoose');

const ViewSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
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

module.exports = mongoose.model('ViewProject', ViewSchema);