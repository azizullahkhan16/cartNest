import express from "express";
import {
  getProductsController,
  getSingleProductController,
} from "../controllers/productsController.js";

const productRouter = express.Router();

productRouter.get("/", getProductsController);
productRouter.get("/:id", getSingleProductController);

export default productRouter;
