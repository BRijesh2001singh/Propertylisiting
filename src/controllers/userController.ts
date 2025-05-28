import { Request,Response } from "express";
import { User } from "../models/userModel";
import { generateToken } from "../utils/jwtokenGenerator";
//register new 
export const registerUser=async(req:Request,res:Response):Promise<any>=>{
   try {
     const {email,password}=req.body;
     if(!email||!password){
     return res.status(400).json({message:"Fields cannot be empty!"});
     }
     const userExists=await User.findOne({email:email});
     if(userExists)return res.status(400).json({message:"User already exists!"});
      const newuser= new User({email:email,password:password});
      await newuser.save();
      return res.status(201).json({message:"New user registered"});
   } catch (error) {
    console.log(error);
    return res.status(500).json({message:"Server error"});
   }
}

//Sign in user
export const loginUser=async(req:Request,res:Response):Promise<void>=>{
   try {
     const {email,password}=req.body;
     if(!email||!password){
   res.status(400).json({message:"Fields cannot be empty!"});
      return;
     }
     const userExists=await User.findOne({email:email});
     if(!userExists){
      res.status(400).json({message:"User does not exist!"});
   return;  
   }
     const passwordMatch=await userExists.comparePassword(password);
     if(!passwordMatch) {
       res.status(400).json({message:"Password does not match."}); //password does not match error
        return;
   }
     const token=generateToken(userExists._id);
     res.cookie('token',token,{
      httpOnly:true,
      secure:false,
      maxAge:60*60*2000
     })
 res.status(200).json({ message: "User logged in successfully. Authentication cookie has been set." });
   } catch (error) {
 res.status(500).json({message:"Server error"});
   }
}