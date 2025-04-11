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
      { expiresIn: "1d" } 
    );
    return res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

exports.register = async (req, res) => {
  const { name, username, email, password, nuclearCode, role } = req.body;
  
  try {
    // Pastikan email atau username belum terdaftar
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if(existingUser) {
      return res.status(400).json({ error: "Email atau Username sudah terdaftar" });
    }
    
    // Buat user baru, role default "friend" kecuali ada keperluan khusus
    const newUser = new User({
      name,
      username,
      email,
      password,
      nuclearCode, 
      role: role || "friend", 
    });
    
    await newUser.save();
    
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server error saat registrasi" });
  }
};
