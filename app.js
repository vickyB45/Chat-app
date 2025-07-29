import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js"
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";


dotenv.config();
connectDB();

const app = express();

// CORS configuration
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true // Allow credentials (cookies, authorization headers, etc.)
}));
// Middleware
app.use(express.json());
app.use(cookieParser());


//Routes
app.get("/",(req,res)=>{
    return res.send("Chat Web Application Server Running.");
});
// API Routes
app.use("/api/auth",authRoutes);
app.use("/api/user",userRoutes);
app.use("/api/chat",chatRoutes);

export default app;