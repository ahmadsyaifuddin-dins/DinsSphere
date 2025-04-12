// src/controllers/activityController.js
const Activity = require("../models/Activity");

// Logging aktivitas user (POST) – tidak boleh diakses oleh role superadmin
exports.logActivity = async (req, res) => {
  // Cek apakah user memiliki role superadmin
  if (req.user && req.user.role === "superadmin") {
    return res.status(403).json({ error: "Superadmin tidak dapat melakukan log aktivitas" });
  }

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

// Mendapatkan laporan aktivitas dengan aggregasi (GET) – diizinkan untuk semua role
exports.getActivityReport = async (req, res) => {
  const { period } = req.query; // "today", "week", "month", dsb.
  let startDate;
  const now = new Date();

  if (period === "today") {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (period === "week") {
    startDate = new Date(now);
    startDate.setDate(now.getDate() - now.getDay());
  } else if (period === "month") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  } else {
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

// Mengambil semua aktivitas (GET) – diizinkan untuk semua role
exports.getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .populate("userId", "name username email");
    res.json(activities);
  } catch (err) {
    console.error("Error fetching activities:", err);
    res.status(500).json({ error: "Failed to fetch activities" });
  }
};

// Mengambil aktivitas berdasarkan user (GET) – diizinkan untuk semua role
exports.getUserActivities = async (req, res) => {
  const { userId } = req.params;
  try {
    const activities = await Activity.find({ userId })
      .sort({ createdAt: -1 })
      .populate("userId", "name username email");
    res.json(activities);
  } catch (err) {
    console.error("Error fetching user activities:", err);
    res.status(500).json({ error: "Failed to fetch user activities" });
  }
};
