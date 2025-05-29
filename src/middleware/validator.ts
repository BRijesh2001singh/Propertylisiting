import { ZodSchema } from "zod";
import { Request, Response, NextFunction, RequestHandler } from "express";

export const validator = (schema: ZodSchema<any>):RequestHandler => {
  return (req: Request, res: Response, next: NextFunction):void=> {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
     res.status(400).json({ message: "Validation failed", error });
       return;
    }
  };
};