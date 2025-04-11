const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifySuperAdmin = require("../middleware/verifySuperAdmin");

// Route untuk login
router.post("/login", authController.login);

// Route untuk Register
router.post("/register", verifySuperAdmin, authController.register);

module.exports = router;
