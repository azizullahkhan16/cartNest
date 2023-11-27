import connectDB from "../config/db.js";
import getJwtEmail from "../utils/getJwtEmail.js";

export const getCartController = async (req, res) => {
  let connection;
  const email = getJwtEmail(req);
  try {
    connection = await connectDB();
    const result = await connection.execute(
      `
    SELECT * 
    FROM cart c
    LEFT JOIN product_category pc
    ON pc.product_id = c.product_id
    WHERE c.userEmail = :email`,
      [email]
    );

    console.log(result.rows);
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

export const addCartController = async (req, res) => {
  let connection;
  const email = getJwtEmail(req);
  const { item } = req.body;
  console.log(item);

  try {
    const id = item.id;
    connection = await connectDB();

    const result = await connection.execute(
      `SELECT *
      FROM CART
      WHERE product_id = :id`,
      [id]
    );

    if (result?.rows.length !== 0) {
      await connection.execute(
        `UPDATE cart
        SET count = count + 1
        WHERE product_id = :id`,
        [id],
        { autoCommit: true } // Auto-commit the transaction
      );
    } else {
      await connection.execute(
        `INSERT INTO cart(userEmail, count, product_id)
      VALUES (:email, 1, :id)`,
        [email, id],
        { autoCommit: true } // Auto-commit the transaction
      );
    }
    res.json({ success: true, msg: "Product added to cart successfully" });
    return;
  } catch (error) {
    console.error("Error in addCartController:", error);
    res.status(500).json({ msg: "Server error" });
  } finally {
    try {
      if (connection) {
        await connection.close();
      }
    } catch (error) {
      console.error("Error closing connection:", error);
    }
  }
};

export const removeCartController = async (req, res) => {
  let connection;
  const email = getJwtEmail(req);

  try {
    connection = await connectDB();
  } catch (error) {
    console.error("Error in addCartController:", error);
    res.status(500).json({ msg: "Server error" });
  } finally {
    try {
      if (connection) {
        await connection.close();
      }
    } catch (error) {
      console.error("Error closing connection:", error);
    }
  }
};
