import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const mongo_uri:string=process.env.MONGO_URI||'';
export const connectDb=async()=>{
   try {
     const conn = await mongoose.connect(mongo_uri);
     console.log(`Mongo connected ${conn.connection.host}`)
   } catch (error) {
    console.log(error);
    process.exit(1);
   }
}