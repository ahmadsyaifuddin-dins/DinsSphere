const mongoose = require("mongoose");
require("dotenv").config();

// Definisikan schema untuk User
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nuclearCode: { type: String, required: true },
    role: { type: String, default: "admin" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema, "users");

const seedUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected for seeding");

    const dummyUser = {
      email: process.env.OWNER_EMAIL || "absolute@gmail.com",
      password: process.env.OWNER_PASSWORD || "AbsolutionProject123",
      nuclearCode: process.env.OWNER_NUCLEAR_CODE || "udinsHebattt",
      role: "admin",
    };

    // Periksa apakah user sudah ada
    const existing = await User.findOne({ email: dummyUser.email });
    if (existing) {
      console.log("User already exists:", dummyUser.email);
    } else {
      const user = new User(dummyUser);
      await user.save();
      console.log("Dummy user created:", user);
    }

    process.exit(0);
  } catch (err) {
    console.error("Error seeding user:", err);
    process.exit(1);
  }
};

seedUser();
