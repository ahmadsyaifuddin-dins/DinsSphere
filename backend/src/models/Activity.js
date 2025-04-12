// src/models/Activity.js
const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  type: { type: String, required: true }, // e.g. "page_view", "task_view"
  path: { type: String, required: true }, // URL atau endpoint yang diakses
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Tasks", default: null }, // optional untuk task spesifik
  details: { type: mongoose.Schema.Types.Mixed }, // informasi tambahan (misal query string, device, dsb)
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Activity", activitySchema);
