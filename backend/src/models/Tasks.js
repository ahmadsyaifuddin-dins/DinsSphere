const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
    {
      gambaranTugas: { type: String }, // URL gambar
      mataKuliah: { type: String, required: true },
      namaTugas: { type: String, required: true },
      deskripsiTugas: { type: String, required: true },
      tingkatKesulitan: { type: String, default: "Not Available" },
      tanggalDiberikan: { type: Date },
      tanggalDeadline: { type: Date },
      progress: { type: Number, default: 0 },
      statusTugas: { type: String, default: "Sedang dikerjain..." },
      tanggalSelesai: { type: Date },
      order: { type: Number, default: 0 }
    },
    { timestamps: true }
  );
  
  const Tasks = mongoose.model("Tasks", TaskSchema);