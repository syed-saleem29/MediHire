const Job = require("../models/Job");

// GET /api/jobs — public, with filters
const getJobs = async (req, res) => {
  try {
    const {
      search,
      specialization,
      city,
      jobType,
      hospitalType,
      shiftType,
      isUrgent,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = { isActive: true };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { hospitalName: { $regex: search, $options: "i" } },
        { specialization: { $regex: search, $options: "i" } },
      ];
    }
    if (specialization) filter.specialization = { $regex: specialization, $options: "i" };
    if (city) filter.city = { $regex: city, $options: "i" };
    if (jobType) filter.jobType = jobType;
    if (hospitalType) filter.hospitalType = hospitalType;
    if (shiftType) filter.shiftType = shiftType;
    if (isUrgent === "true") filter.isUrgent = true;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Job.countDocuments(filter);
    const jobs = await Job.find(filter)
      .populate("postedBy", "name hospitalName")
      .sort({ isUrgent: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({ jobs, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/jobs/:id — public
const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "name hospitalName city phone"
    );
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json({ job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/jobs — HR only
const createJob = async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, postedBy: req.user._id });
    res.status(201).json({ job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/jobs/:id — HR only (own jobs)
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.json({ job: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/jobs/:id — HR only (own jobs)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await job.deleteOne();
    res.json({ message: "Job deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/jobs/my — HR: get own posted jobs
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user._id }).sort({ createdAt: -1 });
    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getJobs, getJob, createJob, updateJob, deleteJob, getMyJobs };
