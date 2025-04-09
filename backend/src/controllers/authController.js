const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.login = async (req, res) => {
  const { email, password, nuclearCode } = req.body;

  try {
    // Cari user berdasarkan email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Bandingkan password dan nuclearCode
    // Reminder: Simpan password dalam hash untuk keamanan maksimal (bukan text biasa)
    if (user.password !== password || user.nuclearCode !== nuclearCode) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Buat JWT token
    const token = jwt.sign(
      { email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } //test supaya cepat untuk auto logout
    );
    return res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
