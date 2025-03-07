const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    gambaranTugas: { type: String }, // URL gambar, opsional sekarang
    mataKuliah: { type: String, required: true },
    namaTugas: { type: String, required: true },
    deskripsiTugas: { type: String, required: true },
    tingkatKesulitan: { type: String, default: "Not Available" },
    tanggalDiberikan: { type: Date },
    tanggalDeadline: { type: Date },
    progress: { type: Number, default: 0 },
    statusTugas: { type: String, default: "Belum Dikerjakan" },
    tanggalSelesai: { type: Date },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

TaskSchema.index({ order: 1 });

TaskSchema.pre('find', function() {
  this.sort({ order: 1 });
});

module.exports = mongoose.model("Tasks", TaskSchema);
