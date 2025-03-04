const express = require("express");
const cors = require("cors");
const connectDB = require("./config/server");
const projectRoutes = require("./routes/projects");
const authRoutes = require("./routes/auth");
const viewsRoutes = require("./routes/views");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server DinsSphere InterConnected berjalan!");
});

app.use("/api/projects", projectRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", viewsRoutes);

// JANGAN panggil app.listen() di sini kalau mau serverless
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));

module.exports = app;

