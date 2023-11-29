import connectDB from "../config/db.js";
import getJwtEmail from "../utils/getJwtEmail.js";

export const getWishlistController = async (req, res) => {
  let connection;
  const email = getJwtEmail(req);
  try {
    connection = await connectDB();
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

export const removeFromWishlistController = async (req, res) => {};
