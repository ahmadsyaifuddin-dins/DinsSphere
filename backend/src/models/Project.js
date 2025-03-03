const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "",
      required: true,
    },
    subtitle: {
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
    icon: {
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
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now, // Diisi saat pertama kali input
      required: true,
    },
    endDate: {
      type: Date, // Opsi, bisa di-update nanti
    },
    status: {
      type: String,
      enum: ["In Progress", "Done", "Paused", "Backlog", "Planning"],
      default: "Planning",
      required: true,
    },
    progress: {
      type: Number,
      default: 0, // Default 0 jika kosong
      required: true,
    },
    order: {
      type: Number,
      default: 0
    },
  
  },
  {
    timestamps: true, // Mongoose akan otomatis menambahkan createdAt & updatedAt
  }
);

projectSchema.index({ order: 1 });

projectSchema.pre('find', function() {
  this.sort({ order: 1 });
});


module.exports = mongoose.model("Project", projectSchema, "projects");
