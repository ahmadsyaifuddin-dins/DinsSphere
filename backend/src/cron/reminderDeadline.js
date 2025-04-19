// cron/reminderDeadline.js
const Task = require('../models/Tasks');
const User = require('../models/User');
const { generateTaskSubject, generateTaskHtml } = require('../messagesEmail/messageServiceTasks');
const transporter = require('../services/mailService').transporter;

async function remindUpcomingDeadlines() {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +1 hari

  // Cari tugas yang deadline besok
  const tasks = await Task.find({
    tanggalDeadline: {
      $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0),
      $lte: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 23, 59, 59)
    }
  });

  if (!tasks.length) return;

  const users = await User.find({}, { email: 1, _id: 0 });
  const emails = users.map(u => u.email).filter(Boolean);

  for (const task of tasks) {
    const subject = `⏰ Reminder: Deadline Tugas ${task.namaTugas} Besok!`;
    const html = `
      <h2>⏰ Deadline Besok!</h2>
      <p>Jangan lupa tugas <strong>${task.namaTugas}</strong> untuk mata kuliah <strong>${task.mataKuliah}</strong> akan berakhir besok.</p>
      <a href="${process.env.CLIENT_URL}/DetailTugasKuliah/${task._id}">Lihat Detail Tugas</a>
    `;

    await transporter.sendMail({
      from: `"DinsSphere" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      bcc: emails,
      subject,
      html,
    });
  }

  console.log(`[CRON] Reminder dikirim untuk ${tasks.length} tugas.`);
}

module.exports = remindUpcomingDeadlines;
