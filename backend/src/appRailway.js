const express = require("express");
const cors = require("cors");
const connectDB = require("./config/server")
const projectRoutes = require("./routes/projects");
const authRoutes = require("./routes/auth");
const viewsRoutes = require('./routes/views');

// Inisialisasi koneksi ke MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Definisikan route dasar (contoh)
app.get("/", (req, res) => {
  res.send("Server DinsSphere berjalan!");
});

// Hanya satu kali deklarasi untuk routes
app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);
app.use('/api', viewsRoutes);

// Mulai server di port yang telah ditentukan
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});