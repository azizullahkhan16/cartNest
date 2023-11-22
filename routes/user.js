import express from "express";
import isUser from "../middlewares/isUser.js";
import { getProfileController } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.use(isUser);

userRouter.get("/profile", getProfileController);

export default userRouter;
