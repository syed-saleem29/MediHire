const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },

    googleId: { type: String },

    // "applicant", "hr", or "pending" (Google users who haven't selected role yet)
    role: { type: String, enum: ["applicant", "hr", "pending"], required: true },

    // Applicant-specific fields
    specialization: { type: String }, // e.g. Cardiologist, Nurse, Lab Tech
    licenseNumber: { type: String },
    licenseVerified: { type: Boolean, default: false },
    experienceYears: { type: Number },
    resumeUrl: { type: String },

    // HR-specific fields
    hospitalName: { type: String },
    hospitalType: {
      type: String,
      enum: ["government", "private", "clinic", "telemedicine"],
    },

    // Shared
    phone: { type: String },
    city: { type: String },
    profileComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
