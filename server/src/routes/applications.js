const express = require("express");
const router = express.Router();
const {
  applyToJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");
const { protect, restrictTo } = require("../middleware/auth");

router.post("/:jobId", protect, restrictTo("applicant"), applyToJob);
router.get("/my", protect, restrictTo("applicant"), getMyApplications);
router.get("/job/:jobId", protect, restrictTo("hr"), getJobApplications);
router.patch("/:id/status", protect, restrictTo("hr"), updateApplicationStatus);

module.exports = router;
