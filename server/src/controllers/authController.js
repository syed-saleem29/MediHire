const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password, role, hospitalName, specialization } =
      req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      hospitalName: role === "hr" ? hospitalName : undefined,
      specialization: role === "applicant" ? specialization : undefined,
    });

    const token = signToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  res.json({ user: req.user });
};

// PATCH /api/auth/select-role — for Google users who signed up without a role
const selectRole = async (req, res) => {
  try {
    const { role, hospitalName, specialization } = req.body;

    if (!["applicant", "hr"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        role,
        hospitalName: role === "hr" ? hospitalName : undefined,
        specialization: role === "applicant" ? specialization : undefined,
      },
      { new: true }
    );

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { register, login, getMe, selectRole };
