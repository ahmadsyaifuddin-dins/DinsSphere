const jwt = require("jsonwebtoken");

function verifyAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // Deteksi kalau tokennya expired
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token expired" });
      } else {
        return res.status(403).json({ error: "Invalid token" });
      }
    }

    // Pastikan role-nya admin
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    req.user = decoded;
    next();
  });
}

module.exports = verifyAdmin;
