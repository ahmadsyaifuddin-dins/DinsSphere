// src/routes/activity.js
const express = require("express");
const router = express.Router();
const { logActivity, getActivityReport, getAllActivities, getUserActivities, getMyActivities } = require("../controllers/activityController");
const verifyUser = require("../middleware/verifyUser");

// Endpoint buat log aktivitas, bisa diakses user tanpa role khusus (kalau ingin proteksi, tambahkan middleware)
router.post("/", verifyUser(["friend", "member", "admin", "superadmin"]), logActivity);

// Endpoint laporan aktivitas, proteksi bisa ditambah berdasarkan peran, misalnya hanya admin bisa lihat report
router.get("/report", verifyUser(["admin", "superadmin"]), getActivityReport);

// Endpoint untuk ambil semua aktivitas detail
router.get("/all", verifyUser(["admin", "superadmin"]), getAllActivities);

// Detail aktivitas user tertentu (harus admin atau superadmin)
router.get("/user/:userId", verifyUser(["admin", "superadmin"]), getUserActivities);

// Detail aktivitas sendiri yang login (harus friend, member, admin, superadmin)
router.get("/me", verifyUser(["friend", "member", "admin", "superadmin"]), getMyActivities);

module.exports = router;
