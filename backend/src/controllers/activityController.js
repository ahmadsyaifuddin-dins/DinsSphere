// src/controllers/activityController.js
const Activity = require("../models/Activity");
const Task = require("../models/Tasks"); // pastikan model ini direquire

// Logging aktivitas user (POST) – jangan menangkap aktivitas superAdmin
exports.logActivity = async (req, res) => {
  // Cek apakah user memiliki role superadmin
  if (req.user && req.user.role === "superadmin") {
    return res.status(403).json({ error: "Tidak Menangkap Aktivitas Superadmin" });
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
      .populate("userId", "name username email")
      .populate("taskId", "mataKuliah"); // Sekarang Mongoose udah tahu tentang model Task
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
      .populate("userId", "name username email")
      .populate("taskId", "mataKuliah"); // Sekarang Mongoose udah tahu tentang model Task
    res.json(activities);
  } catch (err) {
    console.error("Error fetching user activities:", err);
    res.status(500).json({ error: "Failed to fetch user activities" });
  }
};


exports.getMyActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(3) // Batasi hanya 3 aktivitas terbaru
      .populate("userId", "name username email")
      .populate("taskId", "mataKuliah");
    res.json(activities);
  } catch (err) {
    console.error("Error fetching my activities:", err);
    res.status(500).json({ error: "Failed to fetch your activities" });
  }
};
