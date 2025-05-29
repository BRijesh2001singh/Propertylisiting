import { loginUser,registerUser } from "../controllers/userController";
import express from "express";
import { validator } from "../middleware/validator";
import { userSchemaValidate } from "../validator/user.schema";
const userRoutes=express.Router();
userRoutes.post("/signup",validator(userSchemaValidate),registerUser);
userRoutes.post("/signin",loginUser);
export default userRoutes;