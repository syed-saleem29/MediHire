const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { register, login, getMe, selectRole } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);
router.patch("/select-role", protect, selectRole);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed` }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // New user with no role yet → go to role selection page
    if (req.user.role === "pending") {
      return res.redirect(`${process.env.CLIENT_URL}/auth/select-role?token=${token}`);
    }

    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  }
);

module.exports = router;
