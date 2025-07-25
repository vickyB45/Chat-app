import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token; // 👈 Yeh correct hai

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;


    next(); // ✅ All good, continue to route
  } catch (err) {
    console.error("Auth Error:", err.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default protect;
