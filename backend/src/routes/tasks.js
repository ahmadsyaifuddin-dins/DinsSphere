const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const verifyAdmin = require("../middleware/verifyAdmin");

// GET /api/tasks - ambil semua tugas, diurutkan berdasarkan order
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({}).sort({ order: 1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/tasks - buat tugas baru
router.post("/", async (req, res) => {
  try {
    const newTask = new Task(req.body);
    // Set order berdasarkan jumlah tugas yang ada (simple auto-order)
    const count = await Task.countDocuments();
    newTask.order = count;
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
router.put("/:id", async (req, res) => {
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

// DELETE /api/tasks/:id - hapus tugas
router.delete("/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/tasks/order - update urutan tugas
// Diharapkan request body berupa array [{ id: "taskId", order: newOrder }, ...]
router.put("/order", async (req, res) => {
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
