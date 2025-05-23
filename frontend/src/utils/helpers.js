// utils/helpers.js

// Function to determine status Kuliah badge class (detail page)
export const getStatusBadgeClass = (status) => {
    const statusConfig = {
      "Belum Dikerjakan": "bg-red-500",
      "Sedang dikerjain...": "bg-blue-500",
      "Tertunda": "bg-purple-500",
      Selesai: "bg-green-500",
      "Menunggu Review": "bg-indigo-500",
      Revisi: "bg-yellow-500",
    };
    return statusConfig[status] || "bg-gray-500";
  };

   // Function to determine progress Tugas Kuliah color class
   export const getProgressColorClass = (progress) => {
    if (progress >= 80) return "bg-emerald-500"; // Hijau untuk progress baik (>=80%)
    if (progress >= 60) return "bg-green-500";   // Hijau muda untuk progress cukup baik (60-79%)
    if (progress >= 40) return "bg-amber-500";   // Kuning untuk progress menengah (40-59%)
    if (progress >= 20) return "bg-orange-500";  // Oranye untuk progress rendah (20-39%)
    return "bg-rose-500";                        // Merah untuk progress sangat rendah (<20%)
  };
  
  // Function to determine status Tugas Kuliah color (Background color, Text Color, Border Color) class
  export const getStatusColorClass = (status) => {
    switch (status) {
      case "Belum Dikerjakan":
        return "bg-red-500/20 text-red-400 border-red-600";
      case "Sedang dikerjain...":
        return "bg-blue-500/20 text-blue-400 border-blue-500";
      case "Selesai":
        return "bg-green-500/20 text-green-400 border-green-600";
      case "Tertunda":
        return "bg-purple-500/20 text-purple-400 border-purple-500";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-600";
    }
  }; 
  
  // Function to determine status Project color (Background color, Text Color, Border Color) class
  export const getStatusProjectColorClass = (status) => {
    switch (status) {
      case "Done":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-600";
      case "In Progress":
        return "bg-blue-500/20 text-blue-400 border-blue-500";
      case "Paused":
        return "bg-red-500/20 text-red-400 border-red-500";
      case "Backlog":
        return "bg-purple-500/20 text-purple-400 border-purple-500";
      case "Developing":
        return "bg-teal-500/20 text-teal-400 border-teal-600";
      case "Cancelled":
        return "bg-red-500/20 text-red-400 border-red-600";
      case "Planning":
        return "bg-indigo-500/20 text-indigo-400 border-indigo-600";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-600";
    }
  };

  // Format tanggal dengan lebih bersih
  export const formatDate = (dateString) => {
    if (!dateString) return "Belum ditentukan";
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(dateString));
  };

  // Tentukan warna card berdasarkan tipe project
  export const getCardBackground = (type) => {
    switch (type?.toLowerCase()) {
      case "website":
        return "from-indigo-900/40 to-indigo-950/40";
      case "web application":
        return "from-cyan-900/40 to-cyan-950/40";
      case "mobile application":
        return "from-emerald-900/40 to-emerald-950/40";
      case "desktop application":
        return "from-emerald-900/40 to-emerald-950/40";
      case "artificial intelligence":
        return "from-violet-900/40 to-violet-950/40";
      case "data science":
        return "from-violet-900/40 to-violet-950/40";
      case "bot chat":
        return "from-violet-900/40 to-violet-950/40";
      case "game":
        return "from-pink-900/40 to-pink-950/40";
      default:
        return "from-slate-800 to-slate-900";
    }
  };

  // List tipe dan status (opsional, bisa diatur sesuai kebutuhan)
  export const projectTypes = [
    "",
    "Website",
    "Web Application",
    "Mobile Application",
    "Desktop Application",
    "Artificial Intelligence",
    "Data Science",
    "Bot Chat",
    "Game",
  ];

  export const projectStatuses = [
    "",
    "Done",
    "Paused",
    "Planning",
    "In Progress",
    "Backlog",
  ];
  
  // Function to determine remaining days
  export const getRemainingDays = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  

  // Fungsi helper untuk filter berdasarkan progress (menerima nilai numerik)
export const filterByProgress = (task, progressFilter) => {
  if (!progressFilter) return true;

  // Nilai progress disimpan di property 'progress'
  const progress = parseInt(task.progress || 0);

  if (progressFilter === '0') return progress === 0;
  if (progressFilter === '100') return progress === 100;

  const [min, max] = progressFilter.split('-').map(Number);
  return progress >= min && progress <= max;
};

// Fungsi helper untuk filter berdasarkan due date
export const filterByDueDate = (task, dueDateFilter) => {
  if (!dueDateFilter) return true;

  // Mengatur waktu hari ini tanpa jam
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Hari berikutnya
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Lusa (2 hari dari sekarang)
  const lusa = new Date(today);
  lusa.setDate(lusa.getDate() + 2);

  // Kalender untuk minggu ini dan minggu depan
  const dayIndex = today.getDay();
  const thisWeekStart = new Date(today);
  thisWeekStart.setDate(today.getDate() - dayIndex);

  const thisWeekEnd = new Date(thisWeekStart);
  thisWeekEnd.setDate(thisWeekStart.getDate() + 6);

  const nextWeekStart = new Date(thisWeekStart);
  nextWeekStart.setDate(thisWeekStart.getDate() + 7);

  const nextWeekEnd = new Date(nextWeekStart);
  nextWeekEnd.setDate(nextWeekStart.getDate() + 6);

  // Kalender untuk bulan ini dan bulan depan
  const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const nextMonthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0);

  // Tambahan opsi: dua bulan, tiga bulan, dll.
  const twoMonthsStart = new Date(today.getFullYear(), today.getMonth() + 2, 1);
  const twoMonthsEnd = new Date(today.getFullYear(), today.getMonth() + 3, 0);
  const threeMonthsStart = new Date(today.getFullYear(), today.getMonth() + 3, 1);
  const threeMonthsEnd = new Date(today.getFullYear(), today.getMonth() + 4, 0);

  if (!task.tanggalDeadline) return false;
  const dueDate = new Date(task.tanggalDeadline);
  dueDate.setHours(0, 0, 0, 0);

  switch (dueDateFilter) {
    case 'today':
      return dueDate.getTime() === today.getTime();
    case 'tomorrow':
      return dueDate.getTime() === tomorrow.getTime();
    case 'lusa':
      return dueDate.getTime() === lusa.getTime();
    case 'thisWeek':
      return dueDate >= thisWeekStart && dueDate <= thisWeekEnd;
    case 'nextWeek':
      return dueDate >= nextWeekStart && dueDate <= nextWeekEnd;
    case 'thisMonth':
      return dueDate >= thisMonthStart && dueDate <= thisMonthEnd;
    case 'nextMonth':
      return dueDate >= nextMonthStart && dueDate <= nextMonthEnd;
    case 'twoMonths':
      return dueDate >= twoMonthsStart && dueDate <= twoMonthsEnd;
    case 'threeMonths':
      return dueDate >= threeMonthsStart && dueDate <= threeMonthsEnd;
    case 'overdue':
      return dueDate < today;
    default:
      return true;
  }
};

  export const mataKuliahOptions = [
    {
      value: "FTI2006 Etika Profesi",
      label: "Etika Profesi",
      icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj8_3o93ELYEGvrnRZoe0pZa-Fwzs71vnSOeth5vyVkyMghqgmiq5pW4s49PwJxEtvJNUHC2MLPaElx2Daka9l_78puO9zNRZBYKt7syatoHanPqXpcL47lglnK2U1KkXFvEsBebzkHqobV/s700/ilustrasi+Kode+Etik+%2528sumber-+pelajaran.co.id%2529.jpg",
      namaDosen: "Yusri Ikhwani, S.Kom., M.Kom.",
      SKS: 2,
    },
    {
      value: "MGU1007 Fiqih",
      label: "Fiqih",
      icon: "https://www.sinarbarualgensindo.com/wp-content/uploads/2020/06/IMG-20200612-WA0030.jpg",
      SKS: 2,
      namaDosen: "Muhammad Ajrin"
    },
    {
      value: "TIF3601 Jaringan Syaraf Tiruan",
      label: "Jaringan Syaraf Tiruan",
      icon: "https://www.unite.ai/wp-content/uploads/2019/08/artificial-neural-network-3501528_1280.png",
      namaDosen: "Haldi Budiman",
      SKS: 2,
    },
    {
      value: "TIF3602 Riset Operasi",
      label: "Riset Operasi",
      icon: "https://github.com/ahmad-syaifuddin/image-flow/blob/main/riset-operasi.png?raw=true",
      namaDosen: "Galih Mahalisa, S.Kom., M.Kom",
      pointTugas: "40%",
      SKS: 3,
    },
    {
      value: "TIF3603 Sistem Penunjang Keputusan",
      label: "Sistem Penunjang Keputusan",
      icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgOE-HwaJq1mw9ftv0ymXQtYgy68wXNA6VLIC6MrZ8YrF71EbOtGRwIRtO8V7RmHcZPZRPWoqCuI3ZQ6NDksSbyR8BOVjwFPiLsNoPQLYkHVvE8ihFDiRNRykyMvvf65X0BDD7c77jBq_w/s1600/Sistem+Pendukung+Keputusan+(SPK).jpg",
      namaDosen: "Jauhari Maulani",
      SKS: 3,
    },
    {
      value: "TIF3604 Keamanan Sistem Komputer",
      label: "Keamanan Sistem Komputer",
      icon: "https://mohsai.com/wp-content/uploads/2023/07/Apa-itu-Keamanan-Jaringan-Macam-dan-Contohnya-keamanan-jariangan-adalah-1536x864.jpg",
      namaDosen: "Mokhamad Ramdhani Raharjo, S.Kom., M.Kom",
      SKS: 2,
    },
    {
      value: "TIF3605 Manajemen Perangkat Lunak",
      label: "Manajemen Perangkat Lunak",
      icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiVwLf7P1LyGO11oeNaIgTYEWdFg6piiykL_EnXIQMZhk-RkEDPH9LTML31EZRKJlbgyB1opgl-80KoToZMpZ-hj-6Mbk2C6eoyE3SYKzNDHyfRneofNw0nLcuxR9TxnH-kpgsTe0YwKYU/s320/Manajemen+Proyek+Konsep+1.jpg",
      namaDosen: "Aulia Rizky Muhammad Hendrik Noor Asegaff, M. Kom",
      SKS: 2,
    },
    {
      value: "TIF3606 Testing & Implementasi di Bidang TI",
      label: "Testing & Implementasi di Bidang TI",
      icon: "https://matheusrumetna.com/wp-content/uploads/2020/09/testing-sistem.png",
      namaDosen: "Yusup Indra Wijaya, S.Kom., M.Kom.",
      SKS: 2,
      pointTugas: "30%",
    },
    {
      value: "TIF3607 Metodologi & Penelitian di Bidang TI",
      label: "Metodologi & Penelitian di Bidang TI",
      icon: "https://d1e4pidl3fu268.cloudfront.net/0d9f11d4-bfd3-4da5-9e47-2cf846004b6c/6676678542_quantitativedescriptiveresearchquantitativeresearchdesigncliparthd.crop_844x633_8,0.preview.png",
      namaDosen: "Nur Alamsyah, S.Sos., M.Kom",
      SKS: 3,
      pointTugas: "30%",
    },
    {
      value: "TIF3609 Pengolahan Citra",
      label: "Pengolahan Citra",
      icon: "https://cdn-icons-png.flaticon.com/512/6062/6062271.png",
      namaDosen : "Abdurrahman Sidik, S.Sn., M.Ds.",
      SKS : 2,
    },
  ];
