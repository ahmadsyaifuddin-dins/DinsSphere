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
      viewData = new View({ taskId, count: 0, uniqueIPs: [] });
      await viewData.save();
    }
    return res.status(200).json({ count: viewData.count });
  } catch (error) {
    console.error('Error getting view count:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST: Update view count berdasarkan unique IP
router.post('/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: 'Invalid task ID' });
    }

    // Kalau user ada dan role-nya superadmin, jangan catat view
    if (req.user && req.user.role === 'superadmin') {
      const viewData = await View.findOne({ taskId });
      const count = viewData ? viewData.count : 0;
      return res.status(200).json({ count });
    }

    const userIP = req.ip;
    let viewData = await View.findOne({ taskId });
    if (!viewData) {
      // Buat record baru kalau belum ada
      viewData = new View({ taskId, count: 0, uniqueIPs: [] });
    }
    
    // Cek apakah IP user sudah tercatat (menggunakan uniq)
    if (!viewData.uniqueIPs.includes(userIP)) {
      viewData.uniqueIPs.push(userIP);
      viewData.count += 1;
      viewData.lastUpdated = new Date();
      await viewData.save();
    }
    
    return res.status(200).json({ count: viewData.count });
  } catch (error) {
    console.error('Error updating view count:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
