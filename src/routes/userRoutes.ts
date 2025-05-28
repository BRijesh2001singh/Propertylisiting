import { loginUser,registerUser } from "../controllers/userController";
import express from "express";
const userRoutes=express.Router();
userRoutes.post("/signup",registerUser);
userRoutes.post("/signin",loginUser);
export default userRoutes;