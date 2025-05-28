import express from "express";
import { getPropertyById,getProperty, createProperty, updateProperty, deleteProperty, addFavouriteProperties, deleteFavouriteProperty, getFavouriteProperty, propertyReommednation, viewRecommendation, deletePropertyReommednation } from "../controllers/propertyController";
import { verifyToken } from "../middleware/verifyAuth";
import { redisCache } from "../middleware/redisCache";
const propertyRoutes=express.Router();
propertyRoutes.get("/properties/:id",redisCache,getPropertyById);
propertyRoutes.get("/properties",redisCache,getProperty);
propertyRoutes.post("/properties",verifyToken,createProperty);
propertyRoutes.put("/properties/:id",verifyToken,updateProperty);
propertyRoutes.delete("/properties/:id",verifyToken,deleteProperty);

//fav property routes
propertyRoutes.get("/favourites/property",verifyToken,getFavouriteProperty);
propertyRoutes.post("/favourites/property",verifyToken,addFavouriteProperties);
propertyRoutes.delete("/favourites/property",verifyToken,deleteFavouriteProperty);

//property recommendation routes
propertyRoutes.get("/recommend/property",verifyToken,viewRecommendation);
propertyRoutes.post("/recommend/property",verifyToken,propertyReommednation);
propertyRoutes.delete("/recommend/property",verifyToken,deletePropertyReommednation);
export default propertyRoutes;