const express = require('express');
const router = express.Router();
const View = require('../models/ViewProjects');
const mongoose = require('mongoose');

// GET: Mengambil jumlah viewer dari sebuah project
router.get('/:id', async (req, res) => {
  try {
    const projectId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }
    let viewData = await View.findOne({ projectId });
    if (!viewData) {
      viewData = new View({ projectId, count: 0 });
      await viewData.save();
    }
    return res.status(200).json({ count: viewData.count });
  } catch (error) {
    console.error('Error getting view count:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/:id', async (req, res) => {
  try {
    const projectId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }
    const viewData = await View.findOneAndUpdate(
      { projectId },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );
    return res.status(200).json({ count: viewData.count });
  } catch (error) {
    console.error('Error updating view count:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;