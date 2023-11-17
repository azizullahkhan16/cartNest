import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import apiRouter from "./routes/api.js";
import path from "path";

// configure dotenv
dotenv.config();

// rest object
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("./cartNest/images"));

// rest api
app.use("/api", apiRouter);
app.get("/", (req, res) => {
  res.send("<h1>Welcome to cartNest</h1>");
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`.bgCyan.white);
});
