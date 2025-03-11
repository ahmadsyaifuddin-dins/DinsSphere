// routes/projects.js
const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const verifyAdmin = require("../middleware/verifyAdmin");
const projectController = require('../controllers/projectController');

router.post('/reorder', verifyAdmin, projectController.reorderProjects);

// GET semua project dengan filtering, sorting & pagination
router.get("/", async (req, res) => {
  try {
    // Ambil query params: type, status, search, page, limit, dan sortOrder
    const { type, status, search, page, limit, sortOrder } = req.query;

    // Buat query object untuk MongoDB
    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;
    if (search) {
      // Filter berdasarkan judul secara case-insensitive
      query.title = { $regex: search, $options: "i" };
    }

    // Pagination: halaman dan limit item per halaman
    const pageNumber = parseInt(page) || 1;
    const itemsPerPage = parseInt(limit) || 15;

    // Sorting: jika sortOrder 'oldest' maka ascending, default 'newest'
    const sortOption = {};
    if (sortOrder && sortOrder.toLowerCase() === "oldest") {
      sortOption.createdAt = 1;
    } else {
      sortOption.createdAt = -1;
    }

    // Ambil data dengan query, sorting, skip & limit
    const projects = await Project.find(query)
      .sort(sortOption)
      .skip((pageNumber - 1) * itemsPerPage)
      .limit(itemsPerPage);

    // Hitung total project sesuai filter
    const totalProjects = await Project.countDocuments(query);

    res.json({
      projects,
      totalProjects,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalProjects / itemsPerPage)
    });
  } catch (err) {
    res.status(500).json({ message: "Error retrieving projects" });
  }
});

// GET project berdasarkan ID
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving project" });
  }
});

// POST project baru
router.post("/", verifyAdmin, async (req, res) => {
  try {
    const {
      title,
      type,
      subtitle,
      description,
      thumbnail,
      icon,
      linkDemo,
      linkSource,
      technologies,
      difficulty,
      startDate,
      endDate,
      status,
      progress
    } = req.body;

    const newProject = new Project({
      title,
      type,
      subtitle,
      description,
      thumbnail,
      icon,
      linkDemo,
      linkSource,
      technologies, 
      difficulty,
      startDate,
      endDate,
      status,
      progress
    });
    await newProject.save();
    res.json(newProject);
  } catch (err) {
    res.status(500).json({ message: "Error creating project" });
  }
});

// UPDATE project berdasarkan ID
router.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const { title, type, subtitle, description, thumbnail, icon, linkDemo, linkSource, technologies, difficulty, startDate, endDate, status, progress } = req.body;
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { title, type, subtitle, description, thumbnail, icon, linkDemo, linkSource, technologies, difficulty, startDate, endDate, status, progress },
      { new: true }
    );
    res.json(updatedProject);
  } catch (err) {
    res.status(500).json({ message: "Error updating project" });
  }
});

// DELETE project berdasarkan ID
router.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting project" });
  }
});

module.exports = router;
