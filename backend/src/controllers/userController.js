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

// Menghapus Pengguna berdasarkan ID (Soft Delete)
exports.softDeleteUser = async (req, res, next) => {
  const userId = req.params.id;

  try {
    // Update field isDeleted menjadi true
    const user = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, runValidators: true }
    );
    if (!user) {
      const error = new Error("Pengguna tidak ditemukan");
      error.statusCode = 404;
      throw error;
    }
    res
      .status(200)
      .json({ message: "Pengguna berhasil dihapus (soft delete)", user });
  } catch (error) {
    next(error);
  }
};

// Mengembalikan Pengguna (Restore)
exports.restoreUser = async (req, res, next) => {
  const userId = req.params.id;
  try {
    // Update field isDeleted menjadi false
    const user = await User.findByIdAndUpdate(
      userId,
      { isDeleted: false },
      { new: true, runValidators: true }
    );
    if (!user) {
      const error = new Error("Pengguna tidak ditemukan");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "Pengguna berhasil dipulihkan", user });
  } catch (error) {
    next(error);
  }
};

// Mengambil semua user yang telah dihapus (soft deleted)
exports.getDeletedUsers = async (req, res, next) => {
  try {
    // Ambil user yang sudah dihapus, yaitu isDeleted true
    const deletedUsers = await User.find({ isDeleted: true });
    res.status(200).json(deletedUsers);
  } catch (error) {
    next(error);
  }
};

// Edit Data User (id) untuk hak akses Superadmin
exports.EditUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      const error = new Error("Pengguna tidak ditemukan");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: "Pengguna berhasil diperbarui", updatedUser });
  } catch (error) {
    next(error);
  }
};