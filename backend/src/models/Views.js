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
  // Opsional: Anda bisa menambahkan field lain seperti:
  // lastUpdated: { type: Date, default: Date.now }
  // uniqueIPs: [String] // Jika ingin melacak IP unik
});

module.exports = mongoose.model('View', ViewSchema);