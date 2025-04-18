// services/mailService.js
// Bertanggung jawab untuk mengirim email notifikasi tugas

const nodemailer = require('nodemailer');
const User = require('../models/User');
const { generateTaskSubject, generateTaskHtml } = require('../messagesEmail/messageServiceTasks');

// 1) Konfigurasi transporter (SMTP)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// 2) Verifikasi koneksi SMTP saat startup
transporter.verify((err, success) => {
  if (err) console.error('SMTP config error:', err);
  else console.log('✔️ SMTP ready to send messages');
});

/**
 * Kirim email dengan BCC ke semua user terdaftar
 * @param {string} subject
 * @param {string} htmlContent
 */
async function sendTaskEmail(subject, htmlContent) {
  const users = await User.find({}, { email: 1, _id: 0 });
  const emails = users.map(u => u.email).filter(Boolean);
  if (!emails.length) return;

  await transporter.sendMail({
    from: `"DinsSphere" <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_USER,
    bcc: emails,
    subject,
    html: htmlContent,
  });
}

module.exports = {
  /**
   * Notify user about newly created task
   * @param {Object} task
   */
  notifyNewTask: async (task) => {
    const subject = generateTaskSubject(task, 'Baru');
    const html    = generateTaskHtml(task, 'Baru');
    await sendTaskEmail(subject, html);
  },

  /**
   * Notify user about updated task
   * @param {Object} task
   */
  notifyUpdateTask: async (task) => {
    const subject = generateTaskSubject(task, 'Diupdate');
    const html    = generateTaskHtml(task, 'Diupdate');
    await sendTaskEmail(subject, html);
  },
};
