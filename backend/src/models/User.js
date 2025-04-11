// src/models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nuclearCode: { type: String, required: true },
    role: { type: String, default: "friend", enum: ["superadmin", "admin", "friend", "member"] },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema, "users");
