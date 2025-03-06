const express = require('express');
const router = express.Router();
const View = require('../models/ViewTasks');
const mongoose = require('mongoose');

// GET: Mengambil jumlah viewer dari sebuah task
router.get('/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }
    let viewData = await View.findOne({ taskId });
    if (!viewData) {
      viewData = new View({ taskId, count: 0 });
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
    const taskId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }
    const viewData = await View.findOneAndUpdate(
      { taskId },
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