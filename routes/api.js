import express from "express";
import loginRouter from "./login.js";
import signUpRouter from "./signUp.js";
import productRouter from "./products.js";
import sellerRouter from "./seller.js";
import userRouter from "./user.js";

const apiRouter = express.Router();

apiRouter.use("/login", loginRouter);
apiRouter.use("/signup", signUpRouter);
apiRouter.use("/products", productRouter);
apiRouter.use("/seller", sellerRouter);
apiRouter.use("/user", userRouter);

export default apiRouter;
