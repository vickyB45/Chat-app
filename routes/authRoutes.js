import express from "express"
import { handleGetMe, handleLoginUser, handleLogOutUser, handleOnBaord, handleRegisterUser } from "../controllers/authController.js";
import protect from '../middlewares/authMiddleware.js'
import User from "../models/User.js";

const router = express.Router();

router.post("/register",handleRegisterUser)
router.post("/login",handleLoginUser)
router.post("/logout", handleLogOutUser)
router.post("/onbording", protect, handleOnBaord)
router.get("/me",protect,handleGetMe)

//forgot password
//send reset password email


export default router