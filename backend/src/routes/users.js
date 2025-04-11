const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyUser = require("../middleware/verifyUser");

// GET semua pengguna (hanya SuperAdmin)
router.get("/", userController.getAllUsers);

// GET detail pengguna berdasarkan ID
router.get("/:id", userController.getUserById);

// DELETE pengguna berdasarkan ID (soft delete)
router.put("/:id/soft-delete", verifyUser(["superadmin"]), userController.softDeleteUser);

// Route untuk restore (undelete) user
router.put("/:id/undelete", verifyUser(["superadmin"]), userController.restoreUser);

// Route untuk get user yang telah terhapus
router.get("/deleted/all", verifyUser(["superadmin"]), userController.getDeletedUsers);

module.exports = router;