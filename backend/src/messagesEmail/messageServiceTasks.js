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
        timeZone: "Asia/Makassar", // <<< tambahin ini
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

  // Emoji berdasarkan action
  const actionEmoji = action === "Baru" ? "🆕" : "🔄";

  // Warna header berdasarkan action (biru untuk baru, orange untuk update)
  const headerColor = action === "Baru" ? "#1a73e8" : "#f6931d";

  // Warna berdasarkan tingkat kesulitan (mengecek string apakah mengandung kata tertentu)
  let difficultyColor = "#1a73e8"; // default blue

  if (difficulty.includes("Ngopi Santai")) {
    difficultyColor = "#28a745"; // green
  } else if (difficulty.includes("Begadang Sedikit")) {
    difficultyColor = "#17a2b8"; // teal
  } else if (difficulty.includes("Mikir Keras")) {
    difficultyColor = "#ffc107"; // yellow
  } else if (difficulty.includes("Lembur Panik")) {
    difficultyColor = "#fd7e14"; // orange
  } else if (difficulty.includes("Professor Level")) {
    difficultyColor = "#dc3545"; // red
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
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 8px;
            border: 1px solid #ddd;
          }
          .header {
            background-color: ${headerColor};
            color: white;
            padding: 15px 20px;
            border-radius: 6px 6px 0 0;
            margin: -20px -20px 20px;
            text-align: center;
          }
          .footer {
            margin-top: 30px;
            font-size: 12px;
            text-align: center;
            color: #777;
            border-top: 1px solid #ddd;
            padding-top: 15px;
          }
          .info-item {
            background-color: white;
            padding: 12px 15px;
            margin-bottom: 10px;
            border-radius: 6px;
            border-left: 4px solid ${headerColor};
          }
          .info-label {
            font-weight: bold;
            color: #555;
            display: inline-block;
            min-width: 120px;
          }
          .difficulty {
            display: inline-flex;
            align-items: center;
            background-color: ${difficultyColor};
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-weight: bold;
          }
          .action-button {
            display: inline-block;
            background-color: ${headerColor};
            color: white;
            text-decoration: none;
            padding: 12px 20px;
            border-radius: 4px;
            font-weight: bold;
            margin-top: 15px;
            text-align: center;
          }
          .action-button:hover {
            opacity: 0.9;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin:0;">${actionEmoji} Tugas ${action}</h2>
          </div>
          
          <h2 style="margin-top:0; color: #333; text-align: center;">${title}</h2>
          
          <div class="info-item">
            <span class="info-label">📚 Mata Kuliah:</span>
            <span>${course}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">⏰ Deadline:</span>
            <span>${formattedDeadline}</span>
          </div>
          
          <div class="info-item">
            <span class="info-label">💪 Kesulitan:</span>
            <span class="difficulty">${difficulty}</span>
          </div>
          
          <div style="text-align: center; margin-top: 25px;">
            <p>Untuk melihat deskripsi lengkap dan mengerjakan:</p>
            <a href="${
              process.env.CLIENT_URL
            }/DetailTugasKuliah/${id}" class="action-button">
              Lihat Detail Tugas
            </a>
          </div>
          
          <div class="footer">
            <p>Email ini dikirim secara otomatis oleh sistem DinsSphere.</p>
            <p>© ${new Date().getFullYear()} DinsSphere - Platform Manajemen Tugas Mahasiswa</p>
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
