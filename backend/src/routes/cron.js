// routes/cron.js
const express = require('express');
const router = express.Router();
const remindUpcomingDeadlines = require('../cron/reminderDeadline');

router.get('/reminder', async (req, res) => {
  // cek secret
  if (req.headers['x_cron_secret'] !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await remindUpcomingDeadlines();
    res.status(200).json({ message: 'Reminder dijalankan' });
  } catch (err) {
    console.error('[CRON ERROR]', err);
    res.status(500).json({ error: 'Gagal menjalankan reminder' });
  }
});

module.exports = router;
