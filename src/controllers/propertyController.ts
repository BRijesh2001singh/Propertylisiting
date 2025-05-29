import { Property } from "../models/propertyModel";
import { Request,Response } from "express";
import { User } from "../models/userModel";
import redisClient from "../connection/redisConnection";
import { boolean } from "zod";


//get property by id
export const getPropertyById=async(req:Request,res:Response):Promise<void>=>{
try {
    const id=req.params.id;
    const propertyData=await Property.findOne({id:id});
       if (!propertyData) {
      res.status(404).json({ message: "Property not found" });
      return;
    }
    const key=(req as any).key;
    if(key)
    {
            await redisClient.setEx(key, 120, JSON.stringify(propertyData));  //cache data for 2 mins
    }
    res.status(200).json({propertyData:propertyData});

} catch (error) {
    res.status(500).json({message:"error fetching property",error:error})
}
}


//get all property (paginated   &  searched property)
export const getProperty = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      city,
      state,
      type,
      listingType,
      minPrice,
      maxPrice,
      bedrooms,
      furnished,
      bathrooms,
      listedBy,
      page = 1,
      limit = 10,
      rating
    } = req.query;
    const filters: any = {};
    if (city) filters.city={$regex: new RegExp(city as string, "i") }; //change string query to regex to avoid exact match and case sensitive results
    if (state) filters.state= {$regex: new RegExp(state as string, "i") };
    if (type) filters.type=type;
    if (listingType) filters.listingType=listingType;
    if (bedrooms) filters.bedrooms=Number(bedrooms);
    if(rating){
      filters.rating={$gt:Number(rating)};
    }
    if(listedBy){
      const listedBystr=(listedBy as string);
      filters.listedBy=listedBystr[0].toLocaleUpperCase()+listedBystr.slice(1);
    }
  if (furnished) {
    const furnishedStr=(furnished as string);
     filters.furnished=furnishedStr[0].toLocaleUpperCase()+furnishedStr.slice(1);
}
    if (bathrooms) filters.bathrooms=Number(bathrooms);
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte=Number(minPrice);
      if (maxPrice) filters.price.$lte=Number(maxPrice);
    }
    const skip = (Number(page) - 1) * Number(limit);
    const properties = await Property.find(filters).skip(skip).limit(Number(limit));
    const total = await Property.countDocuments(filters);
    const totalPages=Math.ceil(Number(total)/Number(limit));
      const responseData = {
      total,
      totalPages,
      page: Number(page),
      limit: Number(limit),
      propertyData: properties
    };
    if(properties.length){     //  IMPORTANT :: prevents any non existing property data response from caching
    const key=(req as any).key;
    if(key)
    {
            await redisClient.setEx(key, 300, JSON.stringify(responseData));  //cache data for 5 mins
    }
  }
    res.status(200).json(responseData);

  } catch (error) {
    res.status(500).json({message:"error fetching property",error:error})
  }
};




//create a new property
export const createProperty=async(req:Request,res:Response):Promise<void>=>{
try {
    const userId=req.user?.id;  // user id provided through middleware
    console.log(userId);
    if(!userId){
        res.status(401).json({message:"Unauthorized access."});
        return;
    }
    const checkDuplicateId=await Property.findOne({id:req.body.id});
    if(checkDuplicateId){
      res.status(403).json({message:"Duplicate Property Id not allowed"});
      return;
    }
    const propertDetails=new Property({
        ...req.body,
        createdBy:userId
    })
    await propertDetails.save();
        res.status(201).json({ message: "Property created successfully", property: propertDetails });
} catch (error) {
    res.status(500).json({message:"Failed to create property",error:error})
}
}


//update existing property
export const updateProperty=async(req:Request,res:Response):Promise<void>=>{
 try {
      const propertyId=req.params.id;
      const userId=req.user?.id;
      const propertyData=await Property.findOne({id:propertyId});
      if(!propertyData){
          res.status(404).json({message:"Property not found"});
          return;
        }
      if(propertyData.createdBy.toString()!==userId){
        res.status(403).json({message:"Unauthorized"});
        return;
      }
      //remove the previous cached data from redis after update 
      const key=req.originalUrl;
      const cachedData=await redisClient.get(key);
      if(cachedData){
       await redisClient.del(key);
      }
      Object.assign(propertyData,req.body);
      await propertyData.save();
      res.status(200).json({message:"Propery Details updated"});
 } catch (error) {
    res.status(500).json({message:"Failed to update property details",error:error})
 }
}



//delete property
export const deleteProperty=async(req:Request,res:Response):Promise<void>=>{
try {
      const propertyId=req.params.id;
      const userId=req.user?.id;
      const propertyData=await Property.findOne({id:propertyId});
        if(!propertyData){
        res.status(404).json({message:"Property not found"});
        return;
       }
       if(propertyData.createdBy.toString()!==userId){
         res.status(403).json({message:"Unauthorized"});
         return;
       }
         //remove the previous cached data from redis after update 
      const key=req.originalUrl;
      const cachedData=await redisClient.get(key);
      if(cachedData){
       await redisClient.del(key);
      }
       await Property.deleteOne({id:propertyId});
       res.status(200).json({message:"Propery Details deleted"});
} catch (error) {
        res.status(500).json({message:"Failed to delete property details",error:error});
}
}
//get favourites property list for a USER

export const getFavouriteProperty=async(req:Request,res:Response):Promise<void>=>{
const userId=req.user?.id;
const checkUser=await User.findById(userId);
if(!checkUser){
  res.status(404).json({message:"User Not found"});
  return;
}
const favouritesPopulated=await checkUser.populate('favourites');//populate the data based on the ID of property
res.status(200).json({favouritesCount:checkUser.favourites.length,favourites:favouritesPopulated.favourites});
return;
}
//add favorite properties

export const addFavouriteProperties=async(req:Request,res:Response):Promise<void>=>{
 try {
   const {propertyId}=req.body;
   const userId=req.user?.id;    //user id from middleware
   const checkProperty=await Property.findById(propertyId);
   if(!checkProperty){
     res.status(404).json({message:"Property not found."});
     return;
   }
     if(!userId){
         res.status(401).json({message:"Unauthorized."});
         return;
     }
    const user=await User.findById(userId);
   if(!user){
      res.status(404).json({ message: "User not found." });
     return;
   }
   const checkFav=user.favourites.includes(propertyId);
   if(checkFav){
     res.status(400).json({message:"Property already added to favourites"});
   }
   user.favourites.push(propertyId);
   await user.save();
   res.status(200).json({message:"Property added to favourites"});
 } catch (error) {
  res.status(500).json({message:"Failed to update favourites"});
 }
  }

  //delete favourite property
export const deleteFavouriteProperty=async(req:Request,res:Response):Promise<void>=>{
 try {
    const {propertyId}=req.body;
    const userId=req.user?.id;    //user id from middleware
    const checkProperty=await Property.findById(propertyId);
    if(!checkProperty){
      res.status(404).json({message:"Property not found."});
      return;
    }
      if(!userId){
          res.status(401).json({message:"Unauthorized."});
          return;
      }
     const user=await User.findById(userId);
    if(!user){
       res.status(404).json({ message: "User not found." });
      return;
    }
       const index=user.favourites.indexOf(propertyId);
    if(index===-1){
      res.status(400).json({message:"Property not found in Favourites list"});
      return;
    }
    user.favourites.splice(index,1);
    await user.save();
       res.status(200).json({message:"Property removed from favourites list"});
 } catch (error) {
    res.status(500).json({message:"Failed to update favourites"});
 }
}

//view recommended property
export const viewRecommendation=async(req:Request,res:Response):Promise<void>=>{
try {
    const userId=req.user?.id;
 const user=await User.findById(userId);
    res.status(200).json({recommendedProperties:user?.recommendations})
} catch (error) {
  res.status(500).json({message:"Error getting recommended properties",error});
}
 }




//property recommendation 
export const propertyReommednation=async(req:Request,res:Response):Promise<void>=>{
try {
    const {email,propertyId}=req.body;
    const userId=req.user?.id;
    if(!userId){
            res.status(401).json({message:"Unauthorized."});
            return;
    } 
    const recipientUser=await User.findOne({email:email});
    if(!recipientUser){
            res.status(404).json({message:"recipient not found"});
            return;
    }
    if(userId===recipientUser.id){           //prevent self recommendation
      res.status(401).json({message:"Self recommendation not allowed."});
      return;
    }
    const checkProperty=await Property.findById(propertyId);
    if(!checkProperty){
            res.status(404).json({message:"Property Not found"});
            return;
    }
       // Check if property already recommended
    const alreadyRecommended = recipientUser.recommendations.some(
      (rec) => rec.property.toString() === propertyId
    );
if(alreadyRecommended){
      res.status(400).json({ message: "Property already recommended to this user." });
      return;
}

// add new recommendation 
    const recommendationData={
      sender:userId,
      property:propertyId,
     createdAt: new Date()
    }
    recipientUser.recommendations.push(recommendationData);
    await recipientUser.save();
    res.status(200).json({message:"Property recommended successfully."})
} catch (error) {
  res.status(500).json({message:"Error in recommeding property",error});
}
 }

 



 //delete recommended property data using property ID
 export const deletePropertyReommednation=async(req:Request,res:Response):Promise<void>=>{
try {
    const {propertyId}=req.body;
    const userId=req.user?.id;
    if(!userId){
            res.status(401).json({message:"Unauthorized."});
            return;
    } 
    const userData=await User.findById(userId);
        if (!userData) {
      res.status(404).json({ message: "User not found." });
      return;
    }
    const originalLength = userData.recommendations.length;
    userData.recommendations=userData?.recommendations.filter((rec)=>{
      return rec.property.toString()!==propertyId
    });
    if(originalLength===userData.recommendations.length){
      res.status(404).json({message:"Property not found in recommendation List"});
      return;
    }
    await userData.save();
    res.status(200).json({message:"Property recommendation deleted successfully."})
} catch (error) {
  res.status(500).json({message:"Error in deleting recommended property",error});
}
 }