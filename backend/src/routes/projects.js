const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const verifyAdmin = require("../middleware/verifyAdmin");

// GET semua project
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
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
  
      // technologies bisa berupa string (dipisahkan spasi) atau array. 
      // Jika dikirim dalam bentuk string, parse manual:
      // const techArray = technologies.split(" ");
      
      const newProject = new Project({
        title,
        description,
        thumbnail,
        icon,
        linkDemo,
        linkSource,
        // Jika perlu parse: technologies: techArray,
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
    const { title, description, thumbnail, icon, linkDemo, linkSource, technologies, difficulty, startDate, endDate, status, progress } = req.body;
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description, thumbnail, icon, linkDemo, linkSource, technologies, difficulty, startDate, endDate, status, progress },
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
