import express from "express";
import isSeller from "../middlewares/isSeller.js";
import { addProductController } from "../controllers/productsController.js";

const sellerRouter = express.Router();

sellerRouter.use(isSeller);

sellerRouter.post("/addproduct", addProductController);

export default sellerRouter;
