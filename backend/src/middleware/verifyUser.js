// src/middleware/verifyUser.js
const jwt = require("jsonwebtoken");

function verifyUser(allowedRoles = []) {
  return (req, res, next) => {
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
      // Set payload di req.user
      req.user = decoded;
      // Optional: cek role kalau ada allowedRoles
      if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ error: "Access denied" });
      }
      next();
    });
  };
}


module.exports = verifyUser;
