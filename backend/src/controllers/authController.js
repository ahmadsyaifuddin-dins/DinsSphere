const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.login = async (req, res) => {
  const { email, password, nuclearCode } = req.body;

  try {
    // Validasi input
    if (!email || !password || !nuclearCode) {
      return res.status(400).json({ error: "Harap isi semua kolom yang diperlukan" });
    }

    // Cari user berdasarkan email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Email tidak ditemukan" });
    }
    
    // Cek apakah user sudah di-soft delete
    if (user.isDeleted) {
      return res
        .status(403)
        .json({ error: "Akun telah dihapus. Silakan tanya Udins." });
    }

    // Bandingkan password
    if (user.password !== password) {
      return res.status(401).json({ error: "Password salah" });
    }

    // Bandingkan nuclearCode
    if (user.nuclearCode !== nuclearCode) {
      return res.status(401).json({ error: "Kode Nuklir salah" });
    }

    // Buat JWT token
    const token = jwt.sign(
      {
        _id: user._id.toString(), // Tambahkan _id ke payload
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    return res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
};

exports.register = async (req, res) => {
  const { name, username, email, password, nuclearCode, role } = req.body;

  try {
    // Pastikan email atau username belum terdaftar
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email atau Username sudah terdaftar" });
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