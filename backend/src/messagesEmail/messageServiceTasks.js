// services/messageServiceTasks.js
// Bertanggung jawab untuk membuat subject dan HTML pesan notifikasi tugas

/**
 * Generate subject email untuk tugas
 * @param {Object} task - Objek tugas
 * @param {string} action - 'Baru' atau 'Diupdate'
 * @returns {string}
 */
function generateTaskSubject(task, action) {
  // Emoji berdasarkan action
  const emoji = action === "Baru" ? "🆕" : "🔄";
  return `${emoji} Tugas ${action}: ${task.namaTugas}`;
}

/**
 * Generate HTML content email untuk tugas
 * @param {Object} task - Objek tugas
 * @param {string} action - 'Baru' atau 'Diupdate'
 * @returns {string}
 */
function generateTaskHtml(task, action) {
  const title = task.namaTugas;
  const course = task.mataKuliah;
  const deadline = task.tanggalDeadline;
  const difficulty = task.tingkatKesulitan; // Sudah termasuk emoji
  const id = task._id;

  // Format tanggal deadline
  const formattedDeadline = deadline
    ? new Date(deadline).toLocaleString("id-ID", {
        timeZone: "Asia/Makassar",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

  // Emoji berdasarkan action
  const actionEmoji = action === "Baru" ? "🆕" : "🔄";

  // Warna header berdasarkan action (biru untuk baru, orange untuk update)
  const headerColor = action === "Baru" ? "#2563eb" : "#f59e0b";

  // Warna berdasarkan tingkat kesulitan (mengecek string apakah mengandung kata tertentu)
  let difficultyColor = "#2563eb"; // default blue

  if (difficulty.includes("Ngopi Santai")) {
    difficultyColor = "#10b981"; // green - more muted
  } else if (difficulty.includes("Begadang Sedikit")) {
    difficultyColor = "#0ea5e9"; // lighter blue
  } else if (difficulty.includes("Mikir Keras")) {
    difficultyColor = "#f59e0b"; // amber
  } else if (difficulty.includes("Lembur Panik")) {
    difficultyColor = "#ea580c"; // orange - more muted
  } else if (difficulty.includes("Professor Level")) {
    difficultyColor = "#dc2626"; // red - more muted
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Tugas ${action}: ${title}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.6;
          color: #374151;
          margin: 0;
          padding: 0;
          background-color: #f3f4f6;
        }
        .container {
          max-width: 580px;
          margin: 20px auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .header {
          background-color: ${headerColor};
          padding: 20px;
          text-align: center;
        }
        .header h2 {
          margin: 0;
          color: white;
          font-weight: 500;
          font-size: 20px;
        }
        .content {
          padding: 24px;
        }
        .task-title {
          font-size: 22px;
          font-weight: 600;
          color: #111827;
          margin-top: 0;
          margin-bottom: 24px;
          text-align: center;
        }
        .info-item {
          padding: 14px 16px;
          margin-bottom: 12px;
          border-radius: 6px;
          background-color: #f9fafb;
          display: flex;
          align-items: center;
        }
        .info-label {
          font-weight: 500;
          color: #4b5563;
          width: 130px;
        }
        .info-value {
          flex: 1;
        }
        .difficulty-tag {
          display: inline-block;
          background-color: ${difficultyColor};
          color: white;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 14px;
          font-weight: 500;
        }
        .action-section {
          margin-top: 28px;
          text-align: center;
        }
        .action-button {
          display: inline-block;
          background-color: ${headerColor};
          color: white;
          text-decoration: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-weight: 500;
          font-size: 15px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
        }
        .footer {
          margin-top: 28px;
          padding: 16px 0;
          border-top: 1px solid #e5e7eb;
          font-size: 13px;
          text-align: center;
          color: #6b7280;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>${actionEmoji} Tugas ${action}</h2>
        </div>
        
        <div class="content">
          <h2 class="task-title">${title}</h2>
          
          <div class="info-item">
            <span class="info-label">📚 Mata Kuliah</span>
            <span class="info-value">${course}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">⏰ Deadline</span>
            <span class="info-value">${formattedDeadline}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">💪 Kesulitan</span>
            <span class="info-value"><span class="difficulty-tag">${difficulty}</span></span>
          </div>
          
          <div class="action-section">
            <p>Untuk melihat deskripsi lengkap dan mengerjakan:</p>
            <a href="${process.env.CLIENT_URL}/DetailTugasKuliah/${id}" class="action-button">
              Lihat Detail Tugas
            </a>
          </div>
          
          <div class="footer">
            <p>Email ini dikirim secara otomatis oleh sistem DinsSphere.</p>
            <p>© ${new Date().getFullYear()} DinsSphere - Platform Manajemen Tugas Kuliah Mahasiswa dan Projects</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}

module.exports = {
  generateTaskSubject,
  generateTaskHtml,
};