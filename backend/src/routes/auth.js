// src/routes/auth.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // pastikan model User sudah ada

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password, nuclearCode } = req.body;

  try {
    // Cari user berdasarkan email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Bandingkan password dan nuclearCode
    // Catatan: Sebaiknya password disimpan dalam bentuk hash untuk keamanan
    if (user.password !== password || user.nuclearCode !== nuclearCode) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate token JWT
    const token = jwt.sign(
      { email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res.json({ token });
  } catch (err) {
    console.error("Login error: ", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
