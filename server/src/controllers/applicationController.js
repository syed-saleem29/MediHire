const Application = require("../models/Application");
const Job = require("../models/Job");

// POST /api/applications/:jobId — applicant applies
const applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({ message: "Job not found or closed" });
    }

    const existing = await Application.findOne({
      job: req.params.jobId,
      applicant: req.user._id,
    });
    if (existing) {
      return res.status(400).json({ message: "You already applied to this job" });
    }

    const application = await Application.create({
      job: req.params.jobId,
      applicant: req.user._id,
      coverLetter: req.body.coverLetter,
      resumeUrl: req.body.resumeUrl || req.user.resumeUrl,
    });

    await Job.findByIdAndUpdate(req.params.jobId, { $inc: { applicationCount: 1 } });

    res.status(201).json({ application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/applications/my — applicant: own applications
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate("job", "title hospitalName city jobType isUrgent")
      .sort({ createdAt: -1 });
    res.json({ applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/applications/job/:jobId — HR: all applicants for a job
const getJobApplications = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const applications = await Application.find({ job: req.params.jobId })
      .populate("applicant", "name email specialization experienceYears licenseVerified city phone resumeUrl")
      .sort({ createdAt: -1 });

    res.json({ applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/applications/:id/status — HR: update status
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, hrNote } = req.body;
    const application = await Application.findById(req.params.id).populate("job");

    if (!application) return res.status(404).json({ message: "Application not found" });
    if (application.job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = status || application.status;
    application.hrNote = hrNote || application.hrNote;
    await application.save();

    res.json({ application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
};
