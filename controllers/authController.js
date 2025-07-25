import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


// register user
export const handleRegisterUser = async (req, res) => {
    try {
        const { username, password, email } = req.body;

        //check if user is already exist

        const userExistsUsername = await User.findOne({ username })
        if (userExistsUsername) return res.status(400).json({ message: "User already exists with this username" })

        const userExists = await User.findOne({ email })
        if (userExists) return res.status(400).json({ message: "User already exists with this email" })
        //hash password
        const hashedPassword = await bcrypt.hash(password, 16)

        //create new user
        const user = await User.create({
            email,
            password: hashedPassword,
            username
        })

        // Create Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // only HTTPS in production
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.status(201).json({
            token,
            user
        })
    }
    catch (err) {
        res.status(500).json({ message: err.message })
    }
}



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


        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
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


// shwologin user details
export const handleGetMe = async (req, res) => {
    try {

        const user = await User.findById(req.userId).select("-password");
        if (!user || users.length === 0) return res.status(404).json({ message: "No Users found" });
        res.status(200).json(user);

    } catch (err) {
        res.status(401).json({ message: "Unauthorized" });
    }
};


//get all user
export const handleGetAllUser = async (req, res) => {
    try {
        const user = await User.find().select("-password");
        if (!user) {
            return res.status(404).json({ message: "Users not found" });
        }
        res.status(200).json(user)
    }
    catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}   