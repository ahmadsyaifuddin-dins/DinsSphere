// controllers/taskController.js
const Task = require("../models/Tasks");
const Activity = require("../models/Activity");
// Tambahkan import mailService
const { notifyNewTask, notifyUpdateTask } = require("../services/mailService");

// CREATE
exports.createTask = async (req, res) => {
  try {
    const taskData = req.body;
    // Set tanggal selesai kalau status sudah selesai
    if (taskData.statusTugas === "Selesai" && !taskData.tanggalSelesai) {
      const now = new Date();
      taskData.tanggalSelesai = now;
      taskData.tanggalSelesaiWITA = now.toLocaleString("id-ID", {
        timeZone: "Asia/Makassar",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).replace(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+)/, "$3-$1-$2T$4:$5:$6");
    }
    const task = new Task(taskData);
    const savedTask = await task.save();

    // Log aktivitas jika bukan superadmin
    if (req.user && req.user.role !== "superadmin") {
      try {
        const activity = new Activity({
          userId: req.user._id,
          type: "createTugasKuliah",
          path: req.originalUrl,
          taskId: savedTask._id,
          details: `Created new Tugas Kuliah: ${savedTask._id}`,
        });
        await activity.save();
      } catch (logError) {
        console.error("Error logging create Tugas Kuliah activity:", logError);
      }
    }

    // Kirim notifikasi email (non-blocking)
    notifyNewTask(savedTask).catch(err =>
      console.error("Error sending new task email:", err)
    );

    res.status(201).json(savedTask);
  } catch (error) {
    console.error("Error creating Tugas Kuliah:", error);
    res.status(500).json({ message: "Failed to create Tugas Kuliah", error: error.message });
  }
};

// READ all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching Tugas Kuliah:", error);
    res.status(500).json({ message: "Failed to fetch Tugas Kuliah", error: error.message });
  }
};

// READ single task
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Tugas Kuliah not found" });
    res.status(200).json(task);
  } catch (error) {
    console.error("Error fetching Tugas Kuliah:", error);
    res.status(500).json({ message: "Failed to fetch Tugas Kuliah", error: error.message });
  }
};

// UPDATE
exports.updateTask = async (req, res) => {
  try {
    const taskData = req.body;
    // Set tanggal selesai kalau status berubah ke "Selesai"
    if (taskData.statusTugas === "Selesai" && !taskData.tanggalSelesai) {
      const now = new Date();
      taskData.tanggalSelesai = now;
      taskData.tanggalSelesaiWITA = now.toLocaleString("id-ID", {
        timeZone: "Asia/Makassar",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).replace(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+)/, "$3-$1-$2T$4:$5:$6");
    }
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      taskData,
      { new: true, runValidators: true }
    );
    if (!updatedTask)
      return res.status(404).json({ message: "Task not found" });

    // Log aktivitas jika bukan superadmin
    if (req.user && req.user.role !== "superadmin") {
      try {
        const activity = new Activity({
          userId: req.user._id,
          type: "updateTugasKuliah",
          path: req.originalUrl,
          taskId: updatedTask._id,
          details: `Updated Tugas Kuliah: ${updatedTask._id}`,
        });
        await activity.save();
      } catch (logError) {
        console.error("Error logging Update Tugas Kuliah activity:", logError);
      }
    }

    // Kirim notifikasi email update (non-blocking)
    notifyUpdateTask(updatedTask).catch(err =>
      console.error("Error sending update task email:", err)
    );

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating Tugas Kuliah:", error);
    res.status(500).json({ message: "Failed to update Tugas Kuliah", error: error.message });
  }
};

// DELETE
exports.deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ message: "Tugas Kuliah not found" });
    res.status(200).json({ message: "Tugas Kuliah deleted successfully" });
  } catch (error) {
    console.error("Error deleting Tugas Kuliah:", error);
    res.status(500).json({ message: "Failed to delete Tugas Kuliah", error: error.message });
  }
};

// Update order (batch update)
exports.updateTaskOrder = async (req, res) => {
  try {
    const orders = req.body; // array [{ id: "taskId", order: newOrder }, ...]
    const updatePromises = orders.map((item) => 
      Task.findByIdAndUpdate(item.id, { order: item.order })
    );
    await Promise.all(updatePromises);
    res.json({ message: "Order updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Optional: toggle completion
exports.toggleTaskCompletion = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Tugas Kuliah not found" });

    if (task.tanggalSelesai) {
      task.tanggalSelesai = null;
      task.statusTugas = "Belum Dikerjakan";
    } else {
      task.tanggalSelesai = new Date().toISOString();
      task.statusTugas = "Selesai";
    }

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRelatedTasks = async (req, res) => {
  const { mataKuliah, exclude } = req.query;
  try {
    const relatedTasks = await Task.find({
      mataKuliah,
      _id: { $ne: exclude },
    }).limit(5);
    res.json(relatedTasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
