import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRouters from "./routes/authRoutes.js"
import cookieParser from "cookie-parser";


dotenv.config();
connectDB();

const app = express();
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(express.json());
app.use(cookieParser());


//Routes
app.get("/",(req,res)=>{
    return res.send("Chat Web Application Server Running.");
});
app.use("/api/auth",authRouters);

export default app;