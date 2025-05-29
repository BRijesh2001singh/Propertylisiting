import {z} from "zod";

export const userSchemaValidate=z.object({
    email:z.string().email({message:"Invalid email format"}),
    password:z.string().min(5,{message:"Password must be at least 5 characters long"})
})