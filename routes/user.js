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
} from "../controllers/ordersController.js";
import {
  addCartController,
  getCartController,
} from "../controllers/cartController.js";

const userRouter = express.Router();

userRouter.use(isUser);

userRouter.get("/profile", getProfileController);
userRouter.post("/updateinfo", getUpdateProfileController);
userRouter.post("/updatepfp", getUpdateProfilePicController);
userRouter.get("/orders", getOrderController);
userRouter.get("/orders/:id", getSingleOrderController);
userRouter.get("/cart", getCartController);
userRouter.post("/addtocart", addCartController);
export default userRouter;
