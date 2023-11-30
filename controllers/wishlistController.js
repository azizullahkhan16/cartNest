import connectDB from "../config/db.js";
import getJwtEmail from "../utils/getJwtEmail.js";

export const getWishlistController = async (req, res) => {
  let connection;
  const email = getJwtEmail(req);
  try {
    connection = await connectDB();

    const wishlistResult = await connection.execute(
      `SELECT *
      FROM wishlist
      WHERE userEmail = :email`,
      [email]
    );

    let products = [];
    if (wishlistResult.rows.length != 0) {
      let productId;
      for (let i = 0; i < wishlistResult.rows.length; i++) {
        productId = wishlistResult.rows[i][3];

        const productResult = await connection.execute(
          `SELECT *
          FROM product_category
          WHERE product_id = :productId`,
          [productId]
        );

        const product = {};
        for (let i = 0; i < productResult.metaData.length; i++) {
          product[productResult.metaData[i].name.toLowerCase()] =
            productResult.rows[0][i];
        }

        products.push(product);
      }
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ msg: "server error" });
    console.log(error);
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

export const addToWishlistController = async (req, res) => {
  let connection;
  const email = getJwtEmail(req);
  const { id } = req.body;
  try {
    connection = await connectDB();

    const result = await connection.execute(
      `SELECT *
      FROM wishlist
      WHERE product_id = :id`,
      [id]
    );

    if (result?.rows.length !== 0) {
      await connection.execute(
        `UPDATE wishlist
        SET count = count + 1
        WHERE product_id = :id`,
        [id],
        { autoCommit: true } // Auto-commit the transaction
      );
    } else {
      await connection.execute(
        `INSERT INTO wishlist(userEmail, count, product_id)
      VALUES (:email, 1, :id)`,
        [email, id],
        { autoCommit: true } // Auto-commit the transaction
      );
    }
    res.json({ success: true, msg: "Product added to wishlist successfully" });
    return;
  } catch (error) {
    res.status(500).json({ msg: "server error" });
    console.log(error);
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

export const removeFromWishlistController = async (req, res) => {
  let connection;
  const { id } = req.body;
  const email = getJwtEmail(req);
  try {
    connection = await connectDB();
    await connection.execute(
      `DELETE FROM wishlist
      WHERE product_id = :id and userEmail = :email`,
      [id, email],
      { autoCommit: true } // Auto-commit the transaction
    );
    //await connection.commit();
    res.json({
      success: "true",
      msg: "Product removed from wishlist successfully",
    });
  } catch (error) {
    res.status(500).json({ msg: "server error" });
    console.log(error);
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
