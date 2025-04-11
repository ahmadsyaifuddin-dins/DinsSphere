// src/controllers/activityController.js
const Activity = require("../models/Activity");

// Logging aktivitas user
exports.logActivity = async (req, res) => {
    const { type, path, taskId, details } = req.body;
    const userId = req.user ? req.user._id : null;
    
    try {
      const activity = new Activity({ userId, type, path, taskId, details });
      await activity.save();
      res.status(201).json({ message: "Activity logged", activity });
    } catch (err) {
      console.error("Error logging activity:", err);
      res.status(500).json({ error: "Failed to log activity" });
    }
  };

// Mengambil laporan aktivitas dengan aggregasi (contoh: berdasarkan periode)
exports.getActivityReport = async (req, res) => {
  const { period } = req.query; // "today", "week", "month", dsb.
  let startDate;
  const now = new Date();

  // Tentukan startDate berdasarkan query period
  if (period === "today") {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (period === "week") {
    // Asumsikan minggu dimulai dari hari Minggu
    startDate = new Date(now);
    startDate.setDate(now.getDate() - now.getDay());
  } else if (period === "month") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  } else {
    // Default = semua data
    startDate = new Date(0);
  }

  try {
    const report = await Activity.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);
    res.json(report);
  } catch (err) {
    console.error("Error getting activity report:", err);
    res.status(500).json({ error: "Failed to get report" });
  }
};

exports.getAllActivities = async (req, res) => {
    try {
      // Misal, populate field userId untuk dapet info user (kalau sudah ada referensi)
      const activities = await Activity.find().sort({ createdAt: -1 }).populate("userId", "name username email");
      res.json(activities);
    } catch (err) {
      console.error("Error fetching activities:", err);
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  };

  exports.getUserActivities = async (req, res) => {
    const { userId } = req.params;
    try {
      // Misal kita sort descending berdasarkan waktu
      const activities = await Activity.find({ userId })
        .sort({ createdAt: -1 })
        .populate("userId", "name username email");
      res.json(activities);
    } catch (err) {
      console.error("Error fetching user activities:", err);
      res.status(500).json({ error: "Failed to fetch user activities" });
    }
  };