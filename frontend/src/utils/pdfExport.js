// utils/pdfExport.js
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export const exportTaskToPDF = (task) => {
  const doc = new jsPDF();
  const marginLeft = 14;
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header dengan gradient biru
  // Simulate gradient with multiple rectangles
  const startColor = { r: 66, g: 133, b: 244 }; // #4285F4
  const endColor = { r: 84, g: 160, b: 255 }; // #54a0ff
  const steps = 10;
  const rectHeight = 35 / steps;

  for (let i = 0; i < steps; i++) {
    // Calculate color for this step
    const r = Math.floor(
      startColor.r + (endColor.r - startColor.r) * (i / steps)
    );
    const g = Math.floor(
      startColor.g + (endColor.g - startColor.g) * (i / steps)
    );
    const b = Math.floor(
      startColor.b + (endColor.b - startColor.b) * (i / steps)
    );

    doc.setFillColor(r, g, b);
    doc.rect(0, i * rectHeight, pageWidth, rectHeight, "F");
  }

  // Tambahkan nama aplikasi
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("DinsSphere InterConnected", pageWidth / 2, 15, { align: "center" });

  // Judul dokumen
  doc.setFontSize(18);
  doc.text("Detail Tugas", pageWidth / 2, 25, { align: "center" });

  // Tambahkan border bawah header
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.5);
  doc.line(0, 35, pageWidth, 35);

  // Reset font buat konten
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(33, 33, 33);
  let currentY = 50;

  // Box untuk informasi utama
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(
    marginLeft - 4,
    40,
    pageWidth - marginLeft * 2 + 8,
    40,
    3,
    3,
    "F"
  );

  doc.setFont("helvetica", "bold");
  doc.text(`Mata Kuliah:`, marginLeft, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(`${task.mataKuliah}`, marginLeft + 35, currentY);
  currentY += 10;

  // Konten - Informasi utama
  doc.setFont("helvetica", "bold");
  doc.text(`Nama Tugas:`, marginLeft, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(`${task.namaTugas}`, marginLeft + 35, currentY);
  currentY += 10;

  doc.setFont("helvetica", "bold");
  doc.text(`Status:`, marginLeft, currentY);

  // Warna status sesuai jenisnya
  let statusColor;
  switch (task.statusTugas.toLowerCase()) {
    case "selesai":
      statusColor = [46, 125, 50]; // Green
      break;
    case "sedang dikerjain...":
      statusColor = [33, 150, 243]; // Blue
      break;
    case "belum dimulai":
    case "belum dikerjakan":
      statusColor = [198, 40, 40]; // Red
      break;
    default:
      statusColor = [33, 33, 33]; // Default black
  }

  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.setFont("helvetica", "normal");
  doc.text(`${task.statusTugas}`, marginLeft + 35, currentY);
  doc.setTextColor(33, 33, 33);
  currentY += 10;

  // Progress bar
  doc.setFont("helvetica", "bold");
  doc.text(`Progress:`, marginLeft, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(`${task.progress}%`, marginLeft + 35, currentY);

  // Gambar progress bar
  const progressBarWidth = 100;
  const progressBarHeight = 5;
  const progressBarX = marginLeft + 60;
  const progressBarY = currentY - 3;

  // Background progress bar
  doc.setFillColor(224, 224, 224);
  doc.roundedRect(
    progressBarX,
    progressBarY,
    progressBarWidth,
    progressBarHeight,
    2,
    2,
    "F"
  );

  // Progress fill
  doc.setFillColor(33, 150, 243);
  const filledWidth = (task.progress / 100) * progressBarWidth;
  doc.roundedRect(
    progressBarX,
    progressBarY,
    filledWidth,
    progressBarHeight,
    2,
    2,
    "F"
  );

  currentY += 20;

  // Informasi deadline dengan highlight
  if (task.tanggalDeadline) {
    const deadline = new Date(task.tanggalDeadline);
    const deadlineString = deadline.toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Background box untuk deadline
    doc.setFillColor(253, 237, 237);
    doc.roundedRect(
      marginLeft - 4,
      currentY - 5,
      pageWidth - marginLeft * 2 + 8,
      15,
      3,
      3,
      "F"
    );

    // Ikon waktu (simulasi)
    // Improved clock icon
    doc.setDrawColor(198, 40, 40);
    doc.setFillColor(198, 40, 40);

    // Draw circle
    doc.circle(marginLeft + 3, currentY + 2, 3, "S");

    // Draw clock hands
    const centerX = marginLeft + 3;
    const centerY = currentY + 2;

    // Hour hand (shorter)
    doc.setLineWidth(0.5);
    doc.line(centerX, centerY, centerX, centerY - 2);

    // Minute hand (longer)
    doc.setLineWidth(0.5);
    doc.line(centerX, centerY, centerX + 2, centerY);

    // Add small dot in center
    doc.circle(centerX, centerY, 0.5, "F");

    doc.setFont("helvetica", "bold");
    doc.setTextColor(198, 40, 40);
    doc.text(`Deadline:`, marginLeft + 10, currentY + 4);
    doc.setFont("helvetica", "normal");
    doc.text(`${deadlineString}`, marginLeft + 40, currentY + 4);
    doc.setTextColor(33, 33, 33);
    currentY += 20;
  }

  // Deskripsi tugas dengan box
  doc.setFillColor(240, 247, 255);
  doc.roundedRect(
    marginLeft - 4,
    currentY - 5,
    pageWidth - marginLeft * 2 + 8,
    60,
    3,
    3,
    "F"
  );

  doc.setFont("helvetica", "bold");
  doc.text("Deskripsi Tugas:", marginLeft, currentY);
  currentY += 8;
  doc.setFont("helvetica", "normal");
  const deskripsi = task.deskripsiTugas || "Tidak ada deskripsi";
  const splittedText = doc.splitTextToSize(
    deskripsi,
    pageWidth - marginLeft * 2
  );
  doc.text(splittedText, marginLeft, currentY);
  currentY += splittedText.length * 7 + 10;

  // Footer dengan gradient
  const footerHeight = 25;
  const footerY = doc.internal.pageSize.getHeight() - footerHeight;

  // Gradient footer (simulasi dengan rect)
  doc.setFillColor(240, 240, 240);
  doc.rect(0, footerY, pageWidth, footerHeight, "F");

  // Tambahkan line pemisah
  doc.setDrawColor(200);
  doc.setLineWidth(0.5);
  doc.line(0, footerY, pageWidth, footerY);

  // Footer text
  const exportDate = new Date().toLocaleString("id-ID");
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Di-export pada: ${exportDate}`, marginLeft, footerY + 10);

  // Copyright
  doc.setTextColor(100, 100, 100);
  doc.text(
    "© DinsSphere InterConnected",
    pageWidth - marginLeft,
    footerY + 10,
    { align: "right" }
  );

  // Nomor halaman
  doc.text(`Halaman 1 dari 1`, pageWidth / 2, footerY + 18, {
    align: "center",
  });

  const fileName = `${task.mataKuliah} - ${task.namaTugas}.pdf`;
  doc.save(fileName);
};
