import jwt from "jsonwebtoken";
import User from "../models/User.js";

<<<<<<< HEAD
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "default_secret", {
    expiresIn: "7d",
  });
};
=======
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || "default_secret", {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
>>>>>>> origin/main

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
<<<<<<< HEAD

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password.",
=======
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields (name, email, password).",
>>>>>>> origin/main
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
<<<<<<< HEAD

=======
>>>>>>> origin/main
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
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to register user.",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
<<<<<<< HEAD

=======
>>>>>>> origin/main
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

<<<<<<< HEAD
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

=======
    const user = await User.findOne({ email: email.toLowerCase().trim() });
>>>>>>> origin/main
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
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to log in.",
    });
  }
};

export const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
};
