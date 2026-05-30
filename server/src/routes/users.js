const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const User = require("../models/User");

// GET /api/users/profile
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/users/profile
router.patch("/profile", protect, async (req, res) => {
  try {
    const allowed = [
      "name", "phone", "city",
      "specialization", "experienceYears", "licenseNumber",
      "hospitalName", "hospitalType",
    ];
    const updates = {};
    allowed.forEach((k) => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { ...updates, profileComplete: true },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
