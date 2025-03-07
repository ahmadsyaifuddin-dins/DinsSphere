// projectController.js
const Project = require('../models/Project');

// Controller untuk reorder projects
exports.reorderProjects = async (req, res) => {
  try {
    const { order } = req.body;
    
    if (!order || !Array.isArray(order)) {
      return res.status(400).json({ message: 'Invalid order data' });
    }
    
    // Update order untuk setiap project
    const updateOperations = order.map(item => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { order: item.order } }
      }
    }));
    
    await Project.bulkWrite(updateOperations);
    console.log('Projects reordered successfully');
    return res.status(200).json({ message: 'Projects reordered successfully' });
  } catch (error) {
    console.error('Error reordering projects:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Perubahan di controller createProject
exports.createProject = async (req, res) => {
    try {
      // Cari order tertinggi yang ada
      const highestOrderProject = await Project.findOne().sort({ order: -1 });
      const newOrder = highestOrderProject ? highestOrderProject.order + 1 : 0;
      
      // Buat project baru dengan order
      const newProject = new Project({
        ...req.body,
        order: newOrder
      });
      
      const savedProject = await newProject.save();
      res.status(201).json(savedProject);
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };