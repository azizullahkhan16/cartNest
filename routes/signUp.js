import express from "express";
import {
  handleSellerSignUpController,
  handleSignUpController,
} from "../controllers/signUpController.js";

const signUpRouter = express.Router();

signUpRouter.post("/", handleSignUpController);
signUpRouter.post("/seller", handleSellerSignUpController);

export default signUpRouter;
