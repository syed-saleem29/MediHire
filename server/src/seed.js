require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const connectDB = require("./config/db");

const seed = async () => {
  await connectDB();

  // Remove existing test accounts if they exist
  await User.deleteMany({ email: { $in: ["hr@gmail.com", "jobseeker@gmail.com"] } });

  await User.create([
    {
      name: "Test HR",
      email: "hr@gmail.com",
      password: "admin123",
      role: "hr",
      hospitalName: "Apollo Hospital",
      hospitalType: "private",
      city: "Mumbai",
    },
    {
      name: "Test Job Seeker",
      email: "jobseeker@gmail.com",
      password: "job123",
      role: "applicant",
      specialization: "General Medicine",
      city: "Delhi",
    },
  ]);

  console.log("✅ Seeded:");
  console.log("   HR         → hr@gmail.com        / admin123");
  console.log("   Job Seeker → jobseeker@gmail.com  / job123");
  process.exit(0);
};

seed().catch((e) => { console.error(e); process.exit(1); });
