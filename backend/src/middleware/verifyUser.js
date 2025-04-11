const jwt = require("jsonwebtoken");
const User = require("../models/User");

function verifyUser(allowedRoles = []) {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(403).json({ error: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    try {
      // Verifikasi token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Query database buat ambil user berdasarkan id dari token
      const user = await User.findById(decoded._id);
      if (!user || user.isDeleted) {
        return res.status(403).json({ error: "Akun telah dihapus atau tidak tersedia. Silakan tanya Udins." });
      }
      // Set payload di req.user
      req.user = decoded;
      // Cek role jika ada syarat role tertentu
      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ error: "Access denied" });
      }
      next();
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expired" });
      }
      return res.status(403).json({ error: "Invalid token" });
    }
  };
}

module.exports = verifyUser;
