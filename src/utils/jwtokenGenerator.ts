import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
export const generateToken=(userid:mongoose.Types.ObjectId)=>{
    const secret=process.env.JWT_SECRET!;
    return jwt.sign({id:userid},secret,{expiresIn:'2h'}) 
}