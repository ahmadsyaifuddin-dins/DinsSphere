const User = require("../models/User");

// Mengambil semua pengguna (hanya untuk SuperAdmin)
exports.getAllUsers = async (req, res, next) => {
    try {
      // Ambil semua pengguna yang belum dihapus (isDeleted: false)
      const users = await User.find({ isDeleted: false });
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  };
  
  // Mengambil detail pengguna berdasarkan ID
  exports.getUserById = async (req, res, next) => {
    const userId = req.params.id;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        const error = new Error("Pengguna tidak ditemukan");
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };