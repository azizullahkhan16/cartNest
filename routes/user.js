import express from "express";
import isUser from "../middlewares/isUser.js";
import {
  getProfileController,
  getUpdateProfileController,
  getUpdateProfilePicController,
} from "../controllers/userController.js";
import { getOrderController } from "../controllers/ordersController.js";

const userRouter = express.Router();

userRouter.use(isUser);

userRouter.get("/profile", getProfileController);
userRouter.post("/updateinfo", getUpdateProfileController);
userRouter.post("/updatepfp", getUpdateProfilePicController);
userRouter.get("/orders", getOrderController);
export default userRouter;
