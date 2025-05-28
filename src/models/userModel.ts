import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
export interface IRecommendation{
    sender:string;
    property:mongoose.Types.ObjectId;
    createdAt:Date;
};
export interface IUser extends Document{
email:string;
password:string;
favourites:mongoose.Types.ObjectId[];
recommendations:IRecommendation[];
createdAt:Date;
updatedAt:Date;
comparePassword(userPassword: string): Promise<boolean>;
}
const userSchema=new mongoose.Schema<IUser>({
email:{
    type:String,
    require:true,
    unique:true,
},
password:{
type:String,
require:true,

},
favourites:[{
    type:mongoose.Schema.ObjectId,
    ref:'Property'
}],
recommendations:[
    {
        sender:{
            type:mongoose.Schema.ObjectId,
            ref:"User",
        },
        property:{
            type:mongoose.Schema.ObjectId,
            ref:"Property"
        },
        createdAt:{
            type:Date,
            default:Date.now,
        }
    }
],
},{
    timestamps:true,
})
//hash pass word before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
//compare hashed passwords
userSchema.methods.comparePassword=async function(
    userPassword:string
):Promise<boolean>{
return await bcrypt.compare(userPassword,this.password);
}
export const User=mongoose.model<IUser>('User',userSchema);