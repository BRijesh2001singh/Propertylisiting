import express,{Express} from "express";
import dotenv from "dotenv";
import { connectDb } from "./connection/dbConnection";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes";
import propertyRoutes from "./routes/propertyRoutes";
const app:Express=express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
const corsOption={
    origin:"*",
    method:["GET","PUT","POST","DELETE"],
    credentials:true
}
app.use(cors(corsOption));

connectDb(); //connect mongo Database
app.use("/api",userRoutes);
app.use("/api",propertyRoutes);
const PORT=process.env.PORT;
app.listen(PORT,()=>console.log("server started"));