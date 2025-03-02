const express = require('express');
const router = express.Router();
const View = require('../models/Views');
const mongoose = require('mongoose');

// GET: Mengambil jumlah viewer dari sebuah project
router.get('/projects/:id/views', async (req, res) => {
  try {
    const projectId = req.params.id;
    
    // Pastikan ID valid
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }
    
    // Cari view count atau buat jika belum ada
    let viewData = await View.findOne({ projectId });
    
    if (!viewData) {
      viewData = new View({
        projectId,
        count: 0
      });
      await viewData.save();
    }
    
    return res.status(200).json({ count: viewData.count });
  } catch (error) {
    console.error('Error getting view count:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST: Menambah jumlah viewer
router.post('/projects/:id/views', async (req, res) => {
  try {
    const projectId = req.params.id;
    
    // Pastikan ID valid
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }
    
    // Update view count dengan $inc operator (increment)
    const viewData = await View.findOneAndUpdate(
      { projectId },
      { $inc: { count: 1 } },
      { new: true, upsert: true } // upsert: true berarti akan membuat dokumen baru jika tidak ada
    );
    
    return res.status(200).json({ count: viewData.count });
  } catch (error) {
    console.error('Error updating view count:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;