const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// GET semua pengguna (hanya SuperAdmin)
router.get("/", userController.getAllUsers);

// GET detail pengguna berdasarkan ID
router.get("/:id", userController.getUserById);

module.exports = router;