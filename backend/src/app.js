const express = require("express");
const cors = require("cors");
const connectDB = require("./config/server");
const projectRoutes = require("./routes/projects");
const tasksRoutes = require("./routes/tasks");
const viewsProjectRoutes = require("./routes/viewProjects");
const viewTasksRoutes = require("./routes/viewTasks");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const activityRoutes = require("./routes/activity");
const getStatusPage = require("./statusPage");
const cronRoutes = require("./routes/cron");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  const htmlResponse = getStatusPage();
  res.send(htmlResponse);
});

app.use("/api/projects", projectRoutes);
app.use("/api/tasks", tasksRoutes);
app.use("/api/viewTasks", viewTasksRoutes);
app.use("/api/viewProjects", viewsProjectRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/activities", activityRoutes)

app.use("/api/cron", cronRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});

module.exports = app;