// routes/projects.js
const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const verifyAdmin = require("../middleware/verifyAdmin");

// GET semua project dengan filtering, sorting & pagination
router.get("/", async (req, res) => {
  try {
    const { type, status, search, page, limit, sortOrder } = req.query;

    // Buat query object
    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const pageNumber = parseInt(page) || 1;
    const itemsPerPage = parseInt(limit) || 10;

    // Atur opsi sorting berdasarkan startDate
    // Jika sortOrder 'oldest', artinya project lama (startDate paling awal) naik ke atas
    // Jika sortOrder 'newest', project terbaru (startDate paling akhir) naik ke atas
    const sortOption = {};
    if (sortOrder && sortOrder.toLowerCase() === "oldest") {
      sortOption.startDate = 1; // ascending: yang paling tua (lama) di atas
    } else if (sortOrder && sortOrder.toLowerCase() === "newest") {
      sortOption.startDate = -1; // descending: yang terbaru di atas
    } else {
      // fallback kalau nggak ada sortOrder, bisa pakai order manual atau default sorting
      sortOption.order = 1;
    }

    const projects = await Project.find(query)
      .sort(sortOption)
      .skip((pageNumber - 1) * itemsPerPage)
      .limit(itemsPerPage);

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
