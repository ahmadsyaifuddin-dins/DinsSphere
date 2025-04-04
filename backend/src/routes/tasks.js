// routes/tasks.js
const express = require("express");
const router = express.Router();
const verifyAdmin = require("../middleware/verifyAdmin");
const {
  createTask,
  getAllTasks,
  getTaskById,
  getRelatedTasks,
  updateTask,
  deleteTask,
  updateTaskOrder,
  toggleTaskCompletion
} = require("../controllers/taskController");

router.get("/", getAllTasks);
router.post("/", verifyAdmin, createTask);

// Taruh /related sebelum /:id
router.get("/related", getRelatedTasks);
router.get("/:id", getTaskById);

router.put("/:id", verifyAdmin, updateTask);
router.patch("/:id/complete", toggleTaskCompletion);
router.delete("/:id", verifyAdmin, deleteTask);
router.post("/order", verifyAdmin, updateTaskOrder);

module.exports = router;
