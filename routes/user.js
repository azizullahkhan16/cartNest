import express from "express";
import isUser from "../middlewares/isUser.js";
import { getProductsController } from "../controllers/productsController.js";

const userRouter = express.Router();

userRouter.use(isUser);

userRouter.get("/profile", getProductsController);

export default userRouter;
