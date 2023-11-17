import express from "express";
import isSeller from "../middlewares/isSeller.js";
import {
  addProductController,
  editStockController,
  getSellerProductsController,
  getSellerSingleProductController,
} from "../controllers/productsController.js";

const sellerRouter = express.Router();

sellerRouter.use(isSeller);

sellerRouter.post("/addproduct", addProductController);
sellerRouter.post("/editstock", editStockController);

sellerRouter.get("/products", getSellerProductsController);
sellerRouter.get("/products/:id", getSellerSingleProductController);

export default sellerRouter;
