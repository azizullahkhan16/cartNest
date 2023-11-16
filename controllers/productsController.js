import connectDB from "./../config/db.js";
import getJwtEmail from "./../utils/getJwtEmail.js";
import multerInstance from "../multerInstance.js";
import fs from "fs";

export const getProductsController = async (req, res) => {};

export const getSingleProductController = async (req, res) => {};

export const addProductController = async (req, res) => {
  try {
    const upload = multerInstance.array("images", 4);
    upload(req, res, async (err) => {
      if (err?.message === "not supported format") {
        res.status(400).json({ success: false, msg: "not supported format" });
        return;
      } else if (err) {
        console.log(err);
        res.status(500).json({ success: false, msg: "serverrrrrr error" });
        return;
      }

      const {
        name,
        price,
        stock,
        categories,
        description,
        specifications,
        customizations,
      } = JSON.parse(req.body?.productData);
      //   if (
      //     !Array.isArray(categories) ||
      //     categories.filter((el) => !typeof el === "string").length > 0
      //   ) {
      //     req.files?.forEach((el) => {
      //       const filename = el.filename;
      //       console.log(filename);
      //       fs.unlink("./images/" + filename, (err) => {
      //         if (err) {
      //           console.log(err);
      //           console.log("failed to remove file: " + filename);
      //         }
      //       });
      //     });
      //     res.status(400).send("invalid data");
      //     return;
      //   }

      const owner = getJwtEmail(req);
      const images = req.files?.map((el) => el.filename);

      const category = categories[0];
      const image = images[0];
      let connection;
      try {
        connection = await connectDB();
        const isCreated = await connection.execute(
          `INSERT INTO PRODUCT_CATEGORY (owner, name, price, stock, description, categories, images)
            VALUES (:owner, :name, :price, :stock, :description, :category, :image)`,
          [owner, name, price, stock, description, category, image],
          { autoCommit: true } // Auto-commit the transaction
        );

        if (isCreated) {
          res.json({ success: true, msg: "Product added successfully" });
          return;
        }
      } catch (e) {
        console.log(e);
        res.status(500).json({ success: false, msg: "server error" });
        return;
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, msg: "server error" });
    return;
  }
};
