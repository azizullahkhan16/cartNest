import express from "express";
import isUser from "../middlewares/isUser.js";
import {
  getProfileController,
  getUpdateProfileController,
  getUpdateProfilePicController,
} from "../controllers/userController.js";
import {
  getOrderController,
  getSingleOrderController,
  placeOrderController,
} from "../controllers/ordersController.js";
import {
  addCartController,
  clearCartController,
  getCartController,
  removeCartController,
} from "../controllers/cartController.js";
import {
  addToWishlistController,
  getWishlistController,
  removeFromWishlistController,
} from "../controllers/wishlistController.js";

const userRouter = express.Router();

userRouter.use(isUser);

userRouter.get("/profile", getProfileController);
userRouter.post("/updateinfo", getUpdateProfileController);
userRouter.post("/updatepfp", getUpdateProfilePicController);
userRouter.get("/orders", getOrderController);
userRouter.get("/orders/:id", getSingleOrderController);
userRouter.get("/cart", getCartController);
userRouter.post("/addtocart", addCartController);
userRouter.post("/removefromcart", removeCartController);
userRouter.post("/clearcart", clearCartController);
userRouter.get("/wishlist", getWishlistController);
userRouter.post("/addtowishlist", addToWishlistController);
userRouter.post("/removefromwishlist", removeFromWishlistController);
userRouter.post("/placeorder", placeOrderController);
export default userRouter;
