import connectDB from "./../config/db.js";
import getJwtEmail from "./../utils/getJwtEmail.js";
import multerInstance from "../multerInstance.js";
import fs from "fs";

export const getProductsController = async (req, res) => {
  let { page, categories, limit } = req.query;
  page = !isNaN(page) ? page * 1 : 1; // Assuming page numbering starts from 1
  const category = categories[0];

  const offset = (page - 1) * limit;

  let connection;

  try {
    connection = await connectDB();

    // Your SQL query to retrieve paginated results
    const result = await connection.execute(
      `SELECT *
      FROM (
        SELECT
          product_id, name, price, rating, images,
          ROWNUM AS rnum
        FROM
          product_category
        WHERE
          categories = :category
          AND ROWNUM <= :limit + :offset
      )
      WHERE rnum > :offset`,
      {
        category,
        limit: limit,
        offset,
      }
    );

    // Convert ResultSet to an array of objects
    const products = result.rows.map((row) => {
      const product = {};
      for (let i = 0; i < result.metaData.length; i++) {
        product[result.metaData[i].name.toLowerCase()] = row[i];
      }
      return product;
    });
    console.log(products);
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, msg: "server error" });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error("Error closing connection:", error);
      }
    }
  }
};

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
      } finally {
        if (connection) {
          try {
            await connection.close();
          } catch (error) {
            console.error("Error closing connection:", error);
          }
        }
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, msg: "server error" });
    return;
  }
};

export const editStockController = async (req, res) => {
  const email = getJwtEmail(req);
  let connection;
  try {
    connection = await connectDB();
    const { id, mode, value } = req.body;
    const result = await connection.execute(
      `SELECT * 
      FROM product_category
      where product_id = :id`,
      [id]
    );

    const product = result.rows[0];
    if (product[1] !== email) {
      res.status(403).send("Unauthorized");
      return;
    }

    if (value < 0 || (mode === "REMOVE" && value > product[4])) {
      return res.status(400).json({ msg: "Value error" });
    }

    let query;
    switch (mode) {
      case "ADD":
        query = await connection.execute(
          `UPDATE product_category
          SET stock = stock + :value
          WHERE product_id = :id`,
          [value, id],
          { autoCommit: true } // Auto-commit the transaction
        );
        break;
      case "REMOVE":
        query = await connection.execute(
          `UPDATE product_category
          SET stock = stock - :value
          WHERE product_id = :id`,
          [value, id],
          { autoCommit: true } // Auto-commit the transaction
        );
        break;
      case "SET":
        query = await connection.execute(
          `UPDATE product_category
          SET stock = :value
          WHERE product_id = :id`,
          [value, id],
          { autoCommit: true } // Auto-commit the transaction
        );
        break;
      case "ALWAYS AVAILABLE":
        query = await connection.execute(
          `UPDATE product_category
          SET stock = -1
          WHERE product_id = :id`,
          [id],
          { autoCommit: true } // Auto-commit the transaction
        );
        break;
    }
    res.json({ msg: "Updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "server error" });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error("Error closing connection: ", error);
      }
    }
  }
};

export const getSellerProductsController = async (req, res) => {
  const owner = getJwtEmail(req);
  let connection;
  try {
    connection = await connectDB();
    // Execute the query and fetch all rows
    const result = await connection.execute(
      `SELECT *
     FROM Product_Category
     WHERE owner = :owner`,
      [owner]
    );

    // Convert ResultSet to an array of objects
    const products = result.rows.map((row) => {
      const product = {};
      for (let i = 0; i < result.metaData.length; i++) {
        product[result.metaData[i].name.toLowerCase()] = row[i];
      }
      return product;
    });
    res.status(200).json(products);
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Server error" });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error("Error closing connection: ", error);
      }
    }
  }
};

export const getSellerSingleProductController = async (req, res) => {
  const { id } = req.params;
  const email = getJwtEmail(req);
  let connection;

  try {
    connection = await connectDB();
    const result = await connection.execute(
      `SELECT *
      FROM product_category
      where product_id = :id`,
      [id]
    );
    // Check if the product is not found
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, msg: "Product not found" });
    }

    const rawProduct = result.rows[0];
    const product = {
      _id: rawProduct[0],
      owner: rawProduct[1],
      name: rawProduct[2],
      price: rawProduct[3],
      stock: rawProduct[4],
      sold: rawProduct[5],
      rating: rawProduct[6],
      description: rawProduct[7],
      specifications: rawProduct[8],
      categories: rawProduct[9],
      customizations: rawProduct[10],
      images: rawProduct[11],
      deal_newprice: rawProduct[12],
    };
    if (product.owner !== email) {
      return res.status(400).json({ success: false, msg: "Invalid owner." });
    } else {
      return res.json(product);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, msg: "server error" });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (error) {
        console.error("Error closing connection: ", error);
      }
    }
  }
};
