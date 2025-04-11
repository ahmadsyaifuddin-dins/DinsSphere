// src/middleware/verifySuperAdmin.js
const jwt = require("jsonwebtoken");

function verifySuperAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expired" });
      }
      return res.status(403).json({ error: "Invalid token" });
    }

    // Pastikan role-nya superadmin
    if (decoded.role !== "superadmin") {
      return res.status(403).json({ error: "Access denied, must be superadmin" });
    }

    req.user = decoded;
    next();
  });
}

module.exports = verifySuperAdmin;
