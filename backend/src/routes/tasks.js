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
const verifyUser = require("../middleware/verifyUser");

router.get("/", verifyUser(["admin", "superadmin", "friend", "member"]), getAllTasks);
router.post("/", verifyUser(["admin", "superadmin"]), createTask);

// Taruh /related sebelum /:id
router.get("/related", getRelatedTasks);
router.get("/:id", getTaskById);

router.put("/:id", verifyUser(["admin", "superadmin"]), updateTask);
router.patch("/:id/complete", verifyUser(["admin", "superadmin"]), toggleTaskCompletion);
router.delete("/:id", verifyUser(["admin", "superadmin"]), deleteTask);
router.post("/order", verifyUser(["admin", "superadmin"]), updateTaskOrder);

module.exports = router;
