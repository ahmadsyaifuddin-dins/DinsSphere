// utils/pdfExport.js
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { mataKuliahOptions } from "../utils/helpers";

export const exportTaskToPDF = (task) => {
  // Dapatkan data tambahan berdasarkan mata kuliah
  const additionalInfo =
    mataKuliahOptions.find((option) => option.value === task.mataKuliah) || {};

  // Gunakan fallback
  const namaDosen = task.namaDosen || additionalInfo.namaDosen || "Dummy Dosen";
  const SKS =
    task.SKS || (additionalInfo.SKS ? String(additionalInfo.SKS) : "Dummy SKS");
  const pointTugas =
    task.pointTugas || additionalInfo.pointTugas || "Tidak diketahui";

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginLeft = 14;
  let currentY = 50; // posisi vertical awal
  const bottomMargin = 30; // sisa margin bawah (ditambah untuk footer)
  let pageCount = 1; // Menghitung jumlah halaman
  let totalPages = 1; // Total halaman akan diupdate nanti

  // Fungsi bantu: cek apakah butuh page break
  const checkPageBreak = (doc, addedHeight) => {
    if (currentY + addedHeight > pageHeight - bottomMargin) {
      doc.addPage();
      pageCount++; // Increment page count
      currentY = 20; // reset ke margin atas halaman baru
      
      // Tambahkan header kecil di halaman berikutnya
      doc.setFillColor(66, 133, 244);
      doc.rect(0, 0, pageWidth, 15, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.text("DinsSphere InterConnected - Detail Tugas", pageWidth / 2, 10, { align: "center" });
      
      // Reset font ke normal setelah header
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(33, 33, 33);
    }
  };

  // Header dengan gradient
  const startColor = { r: 66, g: 133, b: 244 };
  const endColor = { r: 84, g: 160, b: 255 };
  const steps = 10;
  const rectHeight = 35 / steps;
  for (let i = 0; i < steps; i++) {
    const r = Math.floor(startColor.r + (endColor.r - startColor.r) * (i / steps));
    const g = Math.floor(startColor.g + (endColor.g - startColor.g) * (i / steps));
    const b = Math.floor(startColor.b + (endColor.b - startColor.b) * (i / steps));
    doc.setFillColor(r, g, b);
    doc.rect(0, i * rectHeight, pageWidth, rectHeight, "F");
  }

  // Judul di header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("DinsSphere InterConnected", pageWidth / 2, 15, { align: "center" });
  doc.setFontSize(18);
  doc.text("Detail Tugas", pageWidth / 2, 25, { align: "center" });

  // Garis bawah header
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.5);
  doc.line(0, 35, pageWidth, 35);

  // Konten
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(33, 33, 33);

  // Box Info Utama (tambah tinggi untuk spacing lebih baik)
  checkPageBreak(doc, 50);
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(marginLeft - 4, currentY - 10, pageWidth - marginLeft * 2 + 8, 50, 3, 3, "F");

  // Tulis teks dengan spacing lebih baik
  let lineHeight = 8; // Meningkatkan spacing antar baris
  let labelWidth = 40; // Memperbesar jarak antara label dan nilai
  
  currentY += 0; // posisikan sesuai selera
  
  // Fungsi untuk menuliskan label dan nilai dengan spacing yang lebih baik
  const writeField = (label, value) => {
    doc.text(label + ":", marginLeft, currentY);
    doc.text(value, marginLeft + labelWidth, currentY);
    currentY += lineHeight;
  };

  // Tulis informasi tanpa menggunakan font bold
  writeField("Mata Kuliah", task.mataKuliah);
  writeField("Nama Tugas", task.namaTugas);
  writeField("Dosen Pengampu", namaDosen);
  writeField("SKS", SKS);
  writeField("Point Tugas", pointTugas);

  // Status Tugas
  doc.text("Status:", marginLeft, currentY);
  let statusColor;
  switch (task.statusTugas.toLowerCase()) {
    case "selesai":
      statusColor = [46, 125, 50];
      break;
    case "sedang dikerjain...":
      statusColor = [33, 150, 243];
      break;
    case "belum dikerjakan":
    case "belum dimulai":
      statusColor = [198, 40, 40];
      break;
    case "tertunda":
      statusColor = [128, 0, 128];
      break;
    default:
      statusColor = [33, 33, 33];
  }
  doc.setTextColor(...statusColor);
  doc.text(task.statusTugas, marginLeft + labelWidth, currentY);
  doc.setTextColor(33, 33, 33);
  currentY += lineHeight;

  // Progress
  doc.text("Progress:", marginLeft, currentY);
  doc.text(`${task.progress}%`, marginLeft + labelWidth, currentY);

  // Gambar progress bar (15 px ke bawah untuk spacing lebih baik)
  checkPageBreak(doc, 15);
  const progressBarWidth = 100;
  const progressBarHeight = 5;
  const progressBarX = marginLeft + labelWidth + 25;
  const progressBarY = currentY - 4;
  doc.setFillColor(224, 224, 224);
  doc.roundedRect(progressBarX, progressBarY, progressBarWidth, progressBarHeight, 2, 2, "F");
  doc.setFillColor(33, 150, 243);
  const filledWidth = (task.progress / 100) * progressBarWidth;
  doc.roundedRect(progressBarX, progressBarY, filledWidth, progressBarHeight, 2, 2, "F");
  currentY += lineHeight + 8; // Tambah spacing setelah progress bar

  // Deadline dengan spacing yang lebih baik
  if (task.tanggalDeadline) {
    checkPageBreak(doc, 20);
    const deadline = new Date(task.tanggalDeadline);
    const deadlineString = deadline.toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    doc.setFillColor(253, 237, 237);
    doc.roundedRect(marginLeft - 4, currentY - 5, pageWidth - marginLeft * 2 + 8, 18, 3, 3, "F");

    doc.setDrawColor(198, 40, 40);
    doc.setFillColor(198, 40, 40);
    doc.circle(marginLeft + 3, currentY + 4, 3, "S");
    const centerX = marginLeft + 3;
    const centerY = currentY + 4;
    doc.setLineWidth(0.5);
    doc.line(centerX, centerY, centerX, centerY - 2);
    doc.line(centerX, centerY, centerX + 2, centerY);
    doc.circle(centerX, centerY, 0.5, "F");

    doc.setTextColor(198, 40, 40);
    doc.text("Deadline:", marginLeft + 10, currentY + 6);
    doc.text(deadlineString, marginLeft + labelWidth + 5, currentY + 6);
    doc.setTextColor(33, 33, 33);
    currentY += 25; // Tambah spacing setelah deadline
  }

  // Deskripsi Tugas dengan spacing lebih baik
  // Bersihkan teks
  const cleanText = (text) => {
    return text
      .normalize("NFKC")
      .replace(/\u200B/g, "")
      .replace(/\u2060/g, "")
      .replace(/\uFEFF/g, "")
      .replace(/\u00A0/g, " ")
      .replace(/\s+\n/g, "\n");
  };
  let descriptionText = task.deskripsiTugas
    ? cleanText(task.deskripsiTugas)
    : "Tidak ada deskripsi";

  checkPageBreak(doc, 10);
  doc.text("Deskripsi Tugas:", marginLeft, currentY);
  currentY += 6;
  
  // Tambah border untuk deskripsi
  const descStartY = currentY;
  
  // Pisahkan paragraf
  const paragraphs = descriptionText.split(/\n+/);
  const lineSpacing = 7; // Meningkatkan jarak antar baris
  let descHeight = 0;
  
  // Pre-calculate kebutuhan halaman untuk deskripsi
  let preCurrentY = currentY;
  let prePageCount = pageCount;
  
  paragraphs.forEach((paragraph, index) => {
    if (index > 0) preCurrentY += 4; // Tambah spacing antar paragraf
    
    const trimmed = paragraph.trim();
    if (!trimmed) return; // Skip empty paragraphs
    
    // Wrap teks per baris dengan indentasi
    const wrappedText = doc.splitTextToSize(trimmed, pageWidth - marginLeft * 2 - 10);
    wrappedText.forEach((line) => {
      if (preCurrentY + lineSpacing > pageHeight - bottomMargin) {
        // Simulasi page break
        prePageCount++;
        preCurrentY = 20;
      }
      preCurrentY += lineSpacing;
      descHeight += lineSpacing;
    });
  });
  
  // Actualnya
  currentY = descStartY;
  paragraphs.forEach((paragraph, index) => {
    if (index > 0) currentY += 4; // Tambah spacing antar paragraf
    
    const trimmed = paragraph.trim();
    if (!trimmed) return; // Skip empty paragraphs
    
    // Wrap teks per baris dengan indentasi
    const wrappedText = doc.splitTextToSize(trimmed, pageWidth - marginLeft * 2 - 10);
    wrappedText.forEach((line) => {
      checkPageBreak(doc, lineSpacing);

      // Gambar background untuk baris deskripsi
      doc.setFillColor(250, 250, 250);
      doc.rect(marginLeft - 4, currentY - 5, pageWidth - marginLeft * 2 + 8, lineSpacing + 2, "F");
      
      // Gambar border tipis di kiri deskripsi
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.5);
      doc.line(marginLeft - 2, currentY - 5, marginLeft - 2, currentY + lineSpacing - 3);
      
      doc.setTextColor(33, 33, 33);
      doc.text(line, marginLeft + 5, currentY);
      currentY += lineSpacing;
    });
  });
  
  currentY += 10; // Tambah spacing setelah deskripsi

  // Perbarui jumlah halaman total
  totalPages = pageCount;

  // Function untuk menambahkan footer pada semua halaman
  const addFooters = () => {
    for (let i = 1; i <= totalPages; i++) {
      // Posisi footer
      const footerHeight = 25;
      const footerY = pageHeight - footerHeight;
      
      doc.setPage(i);
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
      doc.text("© DinsSphere InterConnected", pageWidth - marginLeft, footerY + 10, {
        align: "right",
      });
      doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth / 2, footerY + 18, {
        align: "center",
      });
    }
  };

  // Tambahkan footer ke semua halaman SETELAH konten selesai dibuat
  addFooters();

  // Simpan PDF
  const fileName = `${task.mataKuliah} - ${task.namaTugas}.pdf`;
  doc.save(fileName);
};