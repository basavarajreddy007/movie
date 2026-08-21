import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "default_secret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// Register user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields (name, email, password).",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (!normalizedEmail.includes("@") || !normalizedEmail.includes(".")) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      token: generateToken(user._id),
      user,
      watchlist: user.watchlist || [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error during registration.",
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Logged in successfully.",
      token: generateToken(user._id),
      user,
      watchlist: user.watchlist || [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error during login.",
    });
  }
};

// Get current user profile
export const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
    watchlist: req.user.watchlist || [],
  });
};


