// scripts/addOrderFieldToProjects.js
const mongoose = require('mongoose');
const Project = require('./models/Project');
require('dotenv').config();

async function migrateProjectsOrder() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas');
    
    // Ambil semua project tanpa order
    const projects = await Project.find({}).sort({ createdAt: 1 });
    
    // Update setiap project dengan order berdasarkan urutan createdAt
    for (let i = 0; i < projects.length; i++) {
      await Project.updateOne(
        { _id: projects[i]._id },
        { $set: { order: i } }
      );
      console.log(`Updated project ${projects[i].title} with order ${i}`);
    }
    
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateProjectsOrder();