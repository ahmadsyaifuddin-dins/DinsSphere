// utils/pdfExport.js
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // kalau nanti mau dipake

export const exportTaskToPDF = (task) => {
  const doc = new jsPDF();
  const marginLeft = 14;
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header dengan background biru
  doc.setFillColor(33, 150, 243);
  doc.rect(0, 0, pageWidth, 30, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("Detail Tugas", pageWidth / 2, 20, { align: "center" });

  // Reset font buat konten
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(33, 33, 33);
  let currentY = 40;
  doc.text(`Nama Tugas: ${task.namaTugas}`, marginLeft, currentY);
  currentY += 8;
  doc.text(`Mata Kuliah: ${task.mataKuliah}`, marginLeft, currentY);
  currentY += 8;
  doc.text(`Status: ${task.statusTugas}`, marginLeft, currentY);
  currentY += 8;
  doc.text(`Progress: ${task.progress}%`, marginLeft, currentY);
  currentY += 10;

  if (task.tanggalDeadline) {
    const deadline = new Date(task.tanggalDeadline);
    const deadlineString = deadline.toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    doc.text(`Deadline: ${deadlineString}`, marginLeft, currentY);
    currentY += 10;
  }

  doc.setFont("helvetica", "bold");
  doc.text("Deskripsi Tugas:", marginLeft, currentY);
  currentY += 6;
  doc.setFont("helvetica", "normal");
  const deskripsi = task.deskripsiTugas || "Tidak ada deskripsi";
  const splittedText = doc.splitTextToSize(deskripsi, pageWidth - marginLeft * 2);
  doc.text(splittedText, marginLeft, currentY);
  currentY += splittedText.length * 7;

  doc.setDrawColor(200);
  doc.setLineWidth(0.5);
  doc.line(marginLeft, currentY + 5, pageWidth - marginLeft, currentY + 5);

  const exportDate = new Date().toLocaleString("id-ID");
  doc.setFontSize(10);
  doc.text(`Di-export pada: ${exportDate}`, marginLeft, doc.internal.pageSize.getHeight() - 10);

  doc.save(`${task.namaTugas}.pdf`);
};
