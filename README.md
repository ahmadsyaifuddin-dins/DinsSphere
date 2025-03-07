# 🌟 DinsSphere InterConnected

<div align="center">
  
  ![Logo DinsSphere](https://raw.githubusercontent.com/ahmadsyaifuddin-dins/DinsSphere/8fe063a8a94792d2f62dab2af66fb028dc3919a7/frontend/public/icon.svg)
  
  ### Sistem Manajemen Proyek & Tugas Cerdas untuk Mahasiswa
  
  [![Versi](https://img.shields.io/badge/versi-1.0.0-blue.svg)](https://semver.org)
  [![Lisensi](https://img.shields.io/badge/lisensi-MIT-green.svg)](LICENSE)
  [![MERN Stack](https://img.shields.io/badge/stack-MERN-orange.svg)](https://www.mongodb.com/mern-stack)
  
</div>

## 📋 Gambaran Umum

**DinsSphere** adalah solusi komprehensif yang dirancang khusus untuk mahasiswa dalam mengelola proyek akademik dan tugas kuliah secara efisien. Platform ini menyediakan antarmuka yang intuitif untuk mengorganisir proyek dan melacak tugas-tugas mata kuliah, membantu mahasiswa untuk tetap fokus pada tanggung jawab akademis mereka.

---

## 🎯 Tujuan

DinsSphere dibuat untuk mengatasi tantangan umum yang dihadapi mahasiswa dalam melacak dan mengorganisir beban kerja akademis mereka. Dengan menyediakan platform terpusat untuk manajemen proyek dan pelacakan tugas, DinsSphere membantu mahasiswa untuk:

- Memvisualisasikan beban kerja proyek mereka
- Tidak pernah melewatkan tenggat waktu tugas
- Memprioritaskan tugas secara efektif
- Mendokumentasikan perjalanan akademis mereka

---

## ✨ Fitur-Fitur

### 🔖 Manajemen Proyek (Projects)

<table>
  <tr>
    <td>
      <ul>
        <li>🔐 Sistem login admin yang aman</li>
        <li>👀 Mode hanya-baca untuk tamu</li>
        <li>📋 Tampilan proyek fleksibel (Layout List/Grid)</li>
        <li>✏️ Operasi CRUD lengkap untuk proyek</li>
        <li>🔍 Wawasan detail proyek</li>
      </ul>
    </td>
    <td>
      <ul>
        <li>📂 Organisasi drag & drop yang intuitif</li>
        <li>👁️‍🗨️ Pelacakan keterlibatan proyek</li>
        <li>📊 Visualisasi progres</li>
        <li>🏷️ Kategorisasi proyek kustom</li>
        <li>🔔 Notifikasi tenggat waktu proyek</li>
      </ul>
    </td>
  </tr>
</table>

### 📚 Pelacakan Tugas Akademik (Tasks)

<table>
  <tr>
    <td>
      <ul>
        <li>📝 Manajemen tugas komprehensif (tambah, edit, hapus)</li>
        <li>📂 Pengurutan ulang tugas berbasis prioritas dengan drag & drop</li>
        <li>✅ Pelacakan penyelesaian tugas</li>
        <li>🔍 Tampilan informasi tugas terperinci</li>
        <li>🔗 Kemampuan berbagi tugas</li>
      </ul>
    </td>
    <td>
      <ul>
        <li>🖨️ Daftar tugas siap cetak</li>
        <li>📥 Fungsionalitas ekspor PDF</li>
        <li>🗒️ Sistem pencatatan khusus tugas</li>
        <li>🔄 Penautan tugas terkait (prasyarat dan tindak lanjut)</li>
        <li>⏰ Sistem tenggat waktu dan pengingat</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🛠️ Tech Stack

DinsSphere dibangun di atas stack MERN modern dengan teknologi tambahan untuk fungsionalitas yang lebih baik:

<div align="center">
  
![mongodb](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white) ![expressjs](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white) ![react](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![nodejs](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
  
</div>

### Teknologi Utama
- **Frontend**: React.js dengan Vite untuk pengembangan cepat
- **UI Styling**: Tailwind CSS v4.0 untuk desain modern dan responsif
- **Backend**: Node.js dengan framework Express.js
- **Database**: MongoDB untuk penyimpanan dokumen yang fleksibel
- **Autentikasi**: JWT untuk sesi pengguna yang aman

### Tools & Library Tambahan
- **State Management**: Redux Toolkit
- **Drag & Drop**: React DnD
- **Pembuatan PDF**: React-PDF
- **Penanganan Tanggal**: date-fns
- **Validasi Form**: Formik dengan Yup
- **Dokumentasi API**: Swagger UI

---

## 📦 Instalasi & Pengaturan

```bash
# Clone repositori
git clone https://github.com/username-anda/dinssphere.git
cd dinssphere

# Instal dependensi untuk backend
cd server
npm install

# Konfigurasi variabel lingkungan
cp .env.example .env
# Edit .env dengan URI MongoDB Anda dan konfigurasi lainnya

# Instal dependensi untuk frontend
cd ../client
npm install

# Jalankan lingkungan pengembangan
# Terminal 1 - Backend
cd ../server
npm run dev

# Terminal 2 - Frontend
cd ../client
npm run dev
```

### Variabel Lingkungan
Buat file `.env` di direktori server dengan variabel berikut:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/dinssphere
JWT_SECRET=rahasia_jwt_anda
NODE_ENV=development
```

---

## 📸 Tangkapan Layar

<div align="center">
  <img src="https://via.placeholder.com/400x225" alt="Dashboard Proyek" width="400" />
  <img src="https://via.placeholder.com/400x225" alt="Manajemen Tugas" width="400" />
</div>

---

## 🗺️ Rencana Pengembangan

- [ ] Aplikasi mobile (React Native)
- [ ] Integrasi kalender (Google Calendar, Apple Calendar)
- [ ] Prioritas tugas berbasis AI
- [ ] Fitur kolaborasi tim
- [ ] Analitik dan pelaporan yang ditingkatkan
- [ ] Opsi tema Gelap/Terang

---

## 👥 Kontribusi

Kontribusi sangat disambut! Silakan ajukan Pull Request.

1. Fork repositori
2. Buat branch fitur Anda (`git checkout -b fitur/fitur-luar-biasa`)
3. Commit perubahan Anda (`git commit -m 'Menambahkan fitur luar biasa'`)
4. Push ke branch (`git push origin fitur/fitur-luar-biasa`)
5. Buka Pull Request

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file [LICENSE](LICENSE) untuk detailnya.

---

<div align="center">
  
  **Dibuat dengan oleh Ahmad Syaifuddin**
  
  [GitHub](https://github.com/username-anda) • [LinkedIn](https://linkedin.com/in/username-anda) • [Twitter](https://twitter.com/username-anda)
  
</div>
