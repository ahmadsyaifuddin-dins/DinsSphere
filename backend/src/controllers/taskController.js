// controllers/taskController.js
const Task = require("../models/Tasks");

// CREATE
exports.createTask = async (req, res) => {
  try {
    const taskData = req.body;
    // Jika tugas sudah selesai, set tanggal selesai & field WITA
    if (taskData.statusTugas === "Selesai" && !taskData.tanggalSelesai) {
      const now = new Date();
      taskData.tanggalSelesai = now;
      taskData.tanggalSelesaiWITA = now.toLocaleString('id-ID', { 
        timeZone: 'Asia/Makassar',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).replace(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+)/, '$3-$1-$2T$4:$5:$6');
    }
    const task = new Task(taskData);
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Failed to create task", error: error.message });
  }
};

// READ all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Failed to fetch tasks", error: error.message });
  }
};

// READ single task
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ message: "Failed to fetch task", error: error.message });
  }
};

// UPDATE
exports.updateTask = async (req, res) => {
  try {
    const taskData = req.body;
    // Jika status diubah ke "Selesai" dan tanggal selesai belum diset, set waktu sekarang
    if (taskData.statusTugas === "Selesai" && !taskData.tanggalSelesai) {
      const now = new Date();
      taskData.tanggalSelesai = now;
      taskData.tanggalSelesaiWITA = now.toLocaleString('id-ID', { 
        timeZone: 'Asia/Makassar',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).replace(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+)/, '$3-$1-$2T$4:$5:$6');
    }
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, taskData, { new: true, runValidators: true });
    if (!updatedTask) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Failed to update task", error: error.message });
  }
};

// DELETE
exports.deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Failed to delete task", error: error.message });
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

// Optional: toggle completion (bisa dimasukkan ke controller juga)
exports.toggleTaskCompletion = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

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
      _id: { $ne: exclude }, // exclude current task
    }).limit(5);
    res.json(relatedTasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};