const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      poolSize: 10, // maksimal 10 koneksi dalam pool
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}✅`);
  } catch (error) {
    console.log('MongoDB Connection Error ❌', error);
    process.exit(1);
  }
};

module.exports = connectDB;