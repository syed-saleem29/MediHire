const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    hospitalName: { type: String, required: true },
    hospitalType: {
      type: String,
      enum: ["government", "private", "clinic", "telemedicine"],
      required: true,
    },

    // Medical-specific
    specialization: { type: String, required: true }, // e.g. Cardiology, Nursing
    department: { type: String }, // e.g. ICU, ER, OPD
    shiftType: {
      type: String,
      enum: ["day", "night", "rotating", "flexible", null],
      default: null,
    },
    experienceRequired: { type: Number, default: 0 }, // in years
    licenseRequired: { type: Boolean, default: false },

    // Job details
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship"],
      default: "full-time",
    },
    salary: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: "INR" },
    },
    city: { type: String, required: true },
    isUrgent: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    // Who posted this job
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    applicationCount: { type: Number, default: 0 },
    deadline: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
