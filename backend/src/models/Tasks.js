const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    gambaranTugas: { type: String }, // URL gambar, opsional
    mataKuliah: { type: String, required: true },
    namaTugas: { type: String, required: true },
    deskripsiTugas: { type: String, required: true },
    tingkatKesulitan: { type: String, default: "Not Available" },
    
    // Simpan sebagai Date object untuk query/filter berdasarkan tanggal
    tanggalDiberikan: { type: Date },
    tanggalDeadline: { type: Date },
    tanggalSelesai: { type: Date },
    
    // Simpan juga sebagai string untuk tampilan dalam WITA tanpa konversi
    tanggalDiberikanWITA: { type: String },
    tanggalDeadlineWITA: { type: String },
    tanggalSelesaiWITA: { type: String },
    
    progress: { type: Number, default: 0 },
    statusTugas: { type: String, default: "Belum Dikerjakan" },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Gunakan getter virtual untuk mendapatkan tanggal dalam format WITA jika diperlukan
TaskSchema.virtual('tanggalDiberikanFormatted').get(function() {
  return this.tanggalDiberikanWITA || 
    (this.tanggalDiberikan ? new Date(this.tanggalDiberikan).toLocaleString('id-ID', { 
      timeZone: 'Asia/Makassar' 
    }) : null);
});

TaskSchema.virtual('tanggalDeadlineFormatted').get(function() {
  return this.tanggalDeadlineWITA || 
    (this.tanggalDeadline ? new Date(this.tanggalDeadline).toLocaleString('id-ID', { 
      timeZone: 'Asia/Makassar' 
    }) : null);
});

TaskSchema.virtual('tanggalSelesaiFormatted').get(function() {
  return this.tanggalSelesaiWITA || 
    (this.tanggalSelesai ? new Date(this.tanggalSelesai).toLocaleString('id-ID', { 
      timeZone: 'Asia/Makassar' 
    }) : null);
});

// Set toJSON untuk menginclude virtuals
TaskSchema.set('toJSON', { virtuals: true });
TaskSchema.set('toObject', { virtuals: true });

TaskSchema.index({ order: 1 });

TaskSchema.pre('find', function() {
  this.sort({ order: 1 });
});

module.exports = mongoose.model("Tasks", TaskSchema);