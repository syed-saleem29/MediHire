const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    coverLetter: { type: String },
    resumeUrl: { type: String }, // can override profile resume

    status: {
      type: String,
      enum: ["applied", "reviewed", "interview", "hired", "rejected"],
      default: "applied",
    },

    hrNote: { type: String }, // internal note by HR
  },
  { timestamps: true }
);

// One applicant can only apply once per job
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
