const express = require("express");
const router = express.Router();
const Task = require("../models/Tasks");
const verifyAdmin = require("../middleware/verifyAdmin");

// GET /api/tasks - ambil semua tugas, diurutkan berdasarkan order
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({}).sort({ order: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/tasks - buat tugas baru
router.post("/", verifyAdmin, async (req, res) => {
  try {
    // Geser semua tugas yang ada dengan menambahkan 1 ke order-nya
    await Task.updateMany({}, { $inc: { order: 1 }});
    
    // Buat tugas baru dengan order 0
    const newTask = new Task(req.body);
    newTask.order = 0;
    
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// GET /api/tasks/:id - ambil detail tugas berdasarkan id
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/tasks/:id - update tugas
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedTask) return res.status(404).json({ error: "Task not found" });
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PATCH /api/tasks/:id/complete - toggle penyelesaian tugas
router.patch("/:id/complete", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    // Kalau tanggalSelesai udah ada, berarti tugas udah selesai -> ubah jadi belum selesai
    if (task.tanggalSelesai) {
      task.tanggalSelesai = null;
      task.statusTugas = "Belum Dikerjakan";
    } else {
      // Kalau belum selesai, tandai sebagai selesai dengan tanggal sekarang
      task.tanggalSelesai = new Date().toISOString();
      task.statusTugas = "Selesai";
    }

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// DELETE /api/tasks/:id - hapus tugas
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Diharapkan request body berupa array [{ id: "taskId", order: newOrder }, ...]
router.post("/order", verifyAdmin, async (req, res) => {
  try {
    const orders = req.body;
    const updatePromises = orders.map((item) =>
      Task.findByIdAndUpdate(item.id, { order: item.order })
    );
    await Promise.all(updatePromises);
    res.json({ message: "Order updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
