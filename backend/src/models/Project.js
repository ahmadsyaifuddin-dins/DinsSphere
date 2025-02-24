const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String, // Bisa simpan URL gambar, atau path file
      default: "",
    },
    linkDemo: {
      type: String,
      default: "",
    },
    linkSource: {
      type: String,
      default: "",
    },
    technologies: {
      type: [String], // Array of string, misalnya ["react", "node", "express"]
      default: [],
    },
    difficulty: {
      type: String, // Bisa "Easy", "Medium", "Hard", atau level lain
      default: "",
    },
    startDate: {
      type: Date,
      default: Date.now, // Diisi saat pertama kali input
    },
    endDate: {
      type: Date, // Opsi, bisa di-update nanti
    },
    status: {
      type: String,
      enum: ["Developing", "Completed"],
      default: "Developing",
    },
  },
  {
    timestamps: true, // Mongoose akan otomatis menambahkan createdAt & updatedAt
  }
);

module.exports = mongoose.model("Project", projectSchema, "projects");
