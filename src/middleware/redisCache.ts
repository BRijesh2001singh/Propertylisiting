import redisClient from "../connection/redisConnection";
import { Request,Response,NextFunction } from "express";
export const redisCache=async(req:Request,res:Response,next:NextFunction):Promise<void>=>{
try {
    const Key=req.originalUrl;   // full url including the queries
    const cachedData=await redisClient.get(Key);
    if(cachedData){
      res.status(200).json(JSON.parse(cachedData));
         return;
    }
    (req as any).key=Key; //pass on the key to the controller
    next();
} catch (error) {
    console.log("cache middleware error");
    next();
}
}