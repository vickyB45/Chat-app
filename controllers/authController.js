import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import { upsateStreamUser } from "../config/stream.js";


// register user

export const handleRegisterUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  try {
    // 🔐 Validate input
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // 🧠 Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // 🔤 Generate unique username
    const base = name.trim().toLowerCase().padEnd(3, "x").slice(0, 3);
    const uniquePart = uuidv4().split("-")[0].slice(0, 5);
    const username = `${base}${uniquePart}`;

    // 💾 Save user to MongoDB
    const user = await User.create({
      name,
      email,
      password, // password will be hashed in Mongoose pre-save
      username,
    });

    // 💬 Create user in Stream Chat and generate token
    try {
      await upsateStreamUser({
        id: user._id.toString(),
        name: user.name,
        image: user.avatar,
      });
      console.log("Stream user created successfully");
      // const streamToken = streamClient.createToken(user._id.toString());

    }
    catch (error) {
      console.error("Error updating Stream user:", error);
      return res.status(500).json({ message: "Failed to create Stream user" });
    }

    // 🔑 JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';

    res.cookie("token", token, {
      httpOnly: true,
      secure: isSecure,
      sameSite: isSecure ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 🎉 Respond
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
      },
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//login user
export const handleLoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    //check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    //create token 
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });


    const isSecure = req.secure || req.headers['x-forwarded-proto'] === 'https';

    res.cookie("token", token, {
      httpOnly: true,
      secure: isSecure, // Automatically true if HTTPS, false in localhost
      sameSite: isSecure ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // console.log(cookies)
    res.status(200).json({
      token,
      user
    })
  }
  catch (err) {
    res.status(500).json({ message: err.message })
  }
}
//logout
export const handleLogOutUser = (req, res) => {
  try {
    res.clearCookie('token')
    res.status(200).json({ message: "User logged out successfully" });
  }
  catch (err) {
    console.error("Error Logout user", err)
    res.status(500).json({ message: "Internal Server Error" })
  }
}
// shwologin user details
export const handleGetMe = async (req, res) => {
  try {

    const user = await User.findById(req.userId).select("-password");
    if (!user || user.length === 0) return res.status(404).json({ message: "No Users found" });
    res.status(200).json({"user" : user});

  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

// handle onboarding
export const handleOnBaord = async (req, res) => {
  const userId = req.userId;
 try{
   const { name, lastName, bio, location, nationality } = req.body;
  if (!name || !lastName || !bio || !location) {
    return res.status(400).json({
      message:
        "All fields are required",
      missingFields: [
        !name && "name",
        !lastName && "lastName",
        !bio && "bio",
        !location && "location",
        !nationality && "nationality"
      ].filter(Boolean)
    });
  }
const ExistUserName = await User.find({ username: req.body.username });

  if (ExistUserName.length > 0) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {...req.body,
      isOnboarded: true
    },
    { new: true }
  );
  if (!updatedUser) {
    return res.status(404).json({ message: "User not found" });
  }
  res.status(200).json({
    message: "User onboarded successfully",
    updatedUser
  });
  // Update Stream user
try{
    await upsateStreamUser({
    id: updatedUser._id.toString(),
    name: updatedUser.name,
    image: updatedUser.avatar,
  });
  console.log("Stream user updated successfully");
}
catch (error) {
    console.error("Error updating Stream user:", error);
    return res.status(500).json({ message: "Failed to update Stream user" });
  }



 }
 catch(err) {
    console.error("Error during onboarding:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }

}

