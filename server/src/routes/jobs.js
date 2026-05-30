const express = require("express");
const router = express.Router();
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
} = require("../controllers/jobController");
const { protect, restrictTo } = require("../middleware/auth");

router.get("/", getJobs);
router.get("/my", protect, restrictTo("hr"), getMyJobs);
router.get("/:id", getJob);
router.post("/", protect, restrictTo("hr"), createJob);
router.put("/:id", protect, restrictTo("hr"), updateJob);
router.delete("/:id", protect, restrictTo("hr"), deleteJob);

module.exports = router;
