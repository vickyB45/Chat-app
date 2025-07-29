import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { handleGetStreamToken } from "../controllers/chatController.js";

const router = express.Router();


router.get("/token",protect,handleGetStreamToken);


export default router;