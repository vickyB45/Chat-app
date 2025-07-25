import express from "express"
import { handleGetAllUser, handleGetMe, handleLoginUser, handleRegisterUser } from "../controllers/authController.js";
import protect from '../middlewares/authMiddleware.js'

const router = express.Router();

router.post("/register",handleRegisterUser)
router.post("/login",handleLoginUser)
router.get("/me",protect,handleGetMe)
router.get("/all-user", protect, handleGetAllUser)

export default router