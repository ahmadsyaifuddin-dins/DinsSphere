use('dins_sphere');

// 1. Insert Data ke views (opsional)
// db.getCollection('views').insertMany([
//   { title: "View 1", data: "contoh" },
// ]);

// 2. Cari Data tertentu
// const hasil = db.getCollection('views')
//   .find({ count: 1 })
//   .toArray();
// console.log("Hasil Pencarian:", hasil);

// 3. Menampilkan Semua Data
const allData = db.getCollection('projects')
  .find({})
  .toArray();
console.log("Semua Data:", allData);

// 3. Hapus Data yang dituju
// db.getCollection('views').deleteMany({ count: 2 });

// 4. Hapus Semua Data 
// db.getCollection('views').deleteMany({});

// 5. Kamu bisa pakai operator $ne (not equal) di query delete-nya untuk mengecualikan dokumen tertentu
// db.getCollection('views').deleteMany({
//   _id: { $ne: ObjectId("67c466474bb4504cff360427") }
// });
