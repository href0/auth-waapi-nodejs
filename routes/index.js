import express from "express";
import { getOtp, verifyOtp } from "../controllers/Otp.js";
import { Token, refreshToken } from "../controllers/Token.js";
import { getUsers, Register, Login, Logout } from "../controllers/Users.js";
import { verifyToken } from "../middleware/VerifyToken.js";

const router = express.Router();
router.get("/users", verifyToken, getUsers);
router.post("/register", Register);
router.post("/login", Login);
router.get("/otp", getOtp);
router.post("/verifyotp", verifyOtp);
router.get("/token", Token);
router.get("/refreshToken", refreshToken);
router.delete("/logout", Logout);

export default router;
