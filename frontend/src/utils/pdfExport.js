// utils/pdfExport.js
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // Bisa dipakai untuk tampilan tabel kalau diperlukan
import { mataKuliahOptions } from "../utils/helpers";

export const exportTaskToPDF = (task) => {
  // Dapatkan data tambahan berdasarkan mata kuliah (dari helper)
  const additionalInfo =
    mataKuliahOptions.find((option) => option.value === task.mataKuliah) || {};

  // Gunakan fallback untuk data tambahan
  const namaDosen = task.namaDosen || additionalInfo.namaDosen || "Dummy Dosen";
  const SKS =
    task.SKS || (additionalInfo.SKS ? String(additionalInfo.SKS) : "Dummy SKS");
  const pointTugas =
    task.pointTugas || additionalInfo.pointTugas || "Tidak diketahui";

  const doc = new jsPDF();
  const marginLeft = 14;
  const pageWidth = doc.internal.pageSize.getWidth();

  // Fungsi pembersih teks (termasuk karakter dari WA)
  const cleanText = (text) => {
    return text
      .normalize("NFKC")
      // Hapus karakter-karakter tak terlihat
      .replace(/\u200B/g, "")
      .replace(/\u2060/g, "")
      .replace(/\uFEFF/g, "")
      .replace(/\u00A0/g, " ")
      // Hapus spasi berlebih sebelum newline
      .replace(/\s+\n/g, "\n");
  };

  // --- Header dengan Gradient ---
  const startColor = { r: 66, g: 133, b: 244 }; // #4285F4
  const endColor = { r: 84, g: 160, b: 255 }; // #54a0ff
  const steps = 10;
  const rectHeight = 35 / steps;

  for (let i = 0; i < steps; i++) {
    const r = Math.floor(startColor.r + (endColor.r - startColor.r) * (i / steps));
    const g = Math.floor(startColor.g + (endColor.g - startColor.g) * (i / steps));
    const b = Math.floor(startColor.b + (endColor.b - startColor.b) * (i / steps));
    doc.setFillColor(r, g, b);
    doc.rect(0, i * rectHeight, pageWidth, rectHeight, "F");
  }

  // Nama aplikasi di header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("DinsSphere InterConnected", pageWidth / 2, 15, { align: "center" });

  // Judul dokumen
  doc.setFontSize(18);
  doc.text("Detail Tugas", pageWidth / 2, 25, { align: "center" });

  // Garis bawah header
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.5);
  doc.line(0, 35, pageWidth, 35);

  // --- Konten Utama ---
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(33, 33, 33);
  let currentY = 50;

  // Box informasi utama
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

  // Mata Kuliah
  doc.setFont("helvetica", "bold");
  doc.text("Mata Kuliah:", marginLeft, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(task.mataKuliah, marginLeft + 35, currentY);
  currentY += 10;

  // Nama Tugas
  doc.setFont("helvetica", "bold");
  doc.text("Nama Tugas:", marginLeft, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(task.namaTugas, marginLeft + 35, currentY);
  currentY += 10;

  // --- Informasi Tambahan ---
  doc.setFont("helvetica", "bold");
  doc.text("Nama Dosen:", marginLeft, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(namaDosen, marginLeft + 35, currentY);
  currentY += 10;

  doc.setFont("helvetica", "bold");
  doc.text("SKS:", marginLeft, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(SKS, marginLeft + 35, currentY);
  currentY += 10;

  doc.setFont("helvetica", "bold");
  doc.text("Point Tugas:", marginLeft, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(pointTugas, marginLeft + 35, currentY);
  currentY += 10;

  // Status Tugas dengan warna khusus
  doc.setFont("helvetica", "bold");
  doc.text("Status:", marginLeft, currentY);
  let statusColor;
  switch (task.statusTugas.toLowerCase()) {
    case "selesai":
      statusColor = [46, 125, 50]; // Hijau
      break;
    case "sedang dikerjain...":
      statusColor = [33, 150, 243]; // Biru
      break;
    case "belum dimulai":
    case "belum dikerjakan":
      statusColor = [198, 40, 40]; // Merah
      break;
    case "tertunda":
      statusColor = [255, 152, 0]; // Orange
      break;
    default:
      statusColor = [33, 33, 33];
  }
  doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
  doc.setFont("helvetica", "normal");
  doc.text(task.statusTugas, marginLeft + 35, currentY);
  doc.setTextColor(33, 33, 33);
  currentY += 10;

  // Progress Tugas
  doc.setFont("helvetica", "bold");
  doc.text("Progress:", marginLeft, currentY);
  doc.setFont("helvetica", "normal");
  doc.text(`${task.progress}%`, marginLeft + 35, currentY);

  // Gambar Progress Bar
  const progressBarWidth = 100;
  const progressBarHeight = 5;
  const progressBarX = marginLeft + 60;
  const progressBarY = currentY - 3;
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

  // Informasi Deadline (jika ada)
  if (task.tanggalDeadline) {
    const deadline = new Date(task.tanggalDeadline);
    const deadlineString = deadline.toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

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

    // Simulasi ikon jam
    doc.setDrawColor(198, 40, 40);
    doc.setFillColor(198, 40, 40);
    doc.circle(marginLeft + 3, currentY + 2, 3, "S");
    const centerX = marginLeft + 3;
    const centerY = currentY + 2;
    doc.setLineWidth(0.5);
    doc.line(centerX, centerY, centerX, centerY - 2);
    doc.line(centerX, centerY, centerX + 2, centerY);
    doc.circle(centerX, centerY, 0.5, "F");

    doc.setFont("helvetica", "bold");
    doc.setTextColor(198, 40, 40);
    doc.text("Deadline:", marginLeft + 10, currentY + 4);
    doc.setFont("helvetica", "normal");
    doc.text(deadlineString, marginLeft + 40, currentY + 4);
    doc.setTextColor(33, 33, 33);
    currentY += 20;
  }

  // --- Deskripsi Tugas ---
  let descriptionText = task.deskripsiTugas
    ? cleanText(task.deskripsiTugas)
    : "Tidak ada deskripsi";

  doc.setFont("helvetica", "bold");
  doc.text("Deskripsi Tugas:", marginLeft, currentY);
  currentY += 8;

  const lineHeight = 7;
  let textLines = [];
  // Split per paragraf berdasarkan newline
  const paragraphs = descriptionText.split(/\n+/);
  paragraphs.forEach((paragraph) => {
    const trimmed = paragraph.trim();
    if (trimmed.match(/^[\*•]\s*/)) {
      const bulletText = trimmed.replace(/^[\*•]\s*/, "");
      let wrappedText = doc.splitTextToSize(bulletText, pageWidth - marginLeft * 2 - 8);
      wrappedText[0] = "• " + wrappedText[0];
      textLines = textLines.concat(wrappedText);
    } else {
      const wrappedText = doc.splitTextToSize(trimmed, pageWidth - marginLeft * 2);
      textLines = textLines.concat(wrappedText);
    }
    textLines.push(""); // spasi antar paragraf
  });
  if (textLines[textLines.length - 1] === "") {
    textLines.pop();
  }
  const boxHeight = textLines.length * lineHeight + 10;
  doc.setFillColor(240, 247, 255);
  doc.roundedRect(
    marginLeft - 4,
    currentY - 5,
    pageWidth - marginLeft * 2 + 8,
    boxHeight,
    3,
    3,
    "F"
  );
  doc.setFont("helvetica", "normal");
  doc.text(textLines, marginLeft, currentY, { lineHeightFactor: 1.2 });
  currentY += boxHeight + 10;

  // --- Footer dengan Gradient Simulasi ---
  const footerHeight = 25;
  const footerY = doc.internal.pageSize.getHeight() - footerHeight;
  doc.setFillColor(240, 240, 240);
  doc.rect(0, footerY, pageWidth, footerHeight, "F");
  doc.setDrawColor(200);
  doc.setLineWidth(0.5);
  doc.line(0, footerY, pageWidth, footerY);
  const exportDate = new Date().toLocaleString("id-ID");
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Di-export pada: ${exportDate}`, marginLeft, footerY + 10);
  doc.setTextColor(100, 100, 100);
  doc.text("© DinsSphere InterConnected", pageWidth - marginLeft, footerY + 10, { align: "right" });
  doc.text(`Halaman 1 dari 1`, pageWidth / 2, footerY + 18, { align: "center" });

  const fileName = `${task.mataKuliah} - ${task.namaTugas}.pdf`;
  doc.save(fileName);
};
