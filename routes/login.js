import express from "express";
import {
  handleLoginController,
  handleSellerLoginController,
} from "../controllers/loginController.js";

const loginRouter = express.Router();

loginRouter.post("/", handleLoginController);
loginRouter.post("/seller", handleSellerLoginController);

export default loginRouter;
