import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
<<<<<<< HEAD
  const authHeader = req.headers.authorization;
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;
=======
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
>>>>>>> origin/main

  if (!token) {
    return res.status(401).json({
      success: false,
<<<<<<< HEAD
      message: "Token is missing. Please log in.",
=======
      message: "Access denied. Authentication token is missing.",
>>>>>>> origin/main
    });
  }

  try {
    const secret = process.env.JWT_SECRET || "default_secret";
    const decoded = jwt.verify(token, secret);
<<<<<<< HEAD
=======

>>>>>>> origin/main
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
<<<<<<< HEAD
        message: "User not found.",
=======
        message: "User session not found. Please log in again.",
>>>>>>> origin/main
      });
    }

    req.user = user;
    next();
<<<<<<< HEAD
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
=======
  } catch (error) {
    return res.status(401).json({
      success: false,
      message:
        error.name === "TokenExpiredError"
          ? "Session has expired. Please log in again."
          : "Invalid authentication token.",
>>>>>>> origin/main
    });
  }
};
