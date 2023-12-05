import connectDB from "../config/db.js";
import getJwtEmail from "../utils/getJwtEmail.js";

export const getCartController = async (req, res) => {
  let connection;
  const email = getJwtEmail(req);
  try {
    connection = await connectDB();
    const cartResult = await connection.execute(
      `SELECT * 
    FROM cart
    WHERE userEmail = :email AND is_deleted = 0`,
      [email]
    );

    // Convert ResultSet to an array of objects
    const carts = cartResult.rows.map((row) => {
      const cart = {};
      for (let i = 0; i < cartResult.metaData.length; i++) {
        cart[cartResult.metaData[i].name.toLowerCase()] = row[i];
      }
      return cart;
    });

    let products = [];
    let productId;
    if (cartResult.rows.length != 0) {
      for (let i = 0; i < cartResult.rows.length; i++) {
        productId = cartResult.rows[i][2];

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

    console.log(carts);
    console.log(products);
    return res.json({
      cart: carts,
      products: products,
      _id: productId,
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
      WHERE product_id = :id and is_deleted = 0`,
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
        `INSERT INTO cart(useremail, count, product_id, is_deleted)
      VALUES (:email, 1, :id, 0)`,
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
  const { id, refresh } = req.body;

  console.log(id + " " + refresh);

  try {
    connection = await connectDB();
    await connection.execute(
      `UPDATE cart
      SET is_deleted = 1
      WHERE product_id = :id and userEmail = :email`,
      [id, email],
      { autoCommit: true } // Auto-commit the transaction
    );
    if (refresh) {
      return getCartController(req, res);
    }

    res.json({
      success: "true",
      msg: "product removed from cart successfully",
    });
  } catch (error) {
    console.error("Error in removeCartController:", error);
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

export const clearCartController = async (req, res) => {
  let connection;
  const email = getJwtEmail(req);
  try {
    connection = await connectDB();

    await connection.execute(
      `UPDATE cart
      SET is_deleted = 1
      WHERE userEmail = :email`,
      [email],
      { autoCommit: true }
    );

    res.json({ success: true, msg: "Clear cart successfully" });
  } catch (error) {
    console.error("Error in clearing the cart:", error);
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

export const updateItemCountController = async (req, res) => {
  let connection;
  const email = getJwtEmail(req);
  const { id, count, refresh } = req.body;
  try {
    connection = await connectDB();

    await connection.execute(
      `UPDATE cart
      SET count = :count
      WHERE useremail = :email AND product_id = :id`,
      [count, email, id],
      { autoCommit: true }
    );

    if (refresh) {
      return getCartController(req, res);
    }
    res.json({ success: true, msg: "Updated quantity successfully" });
  } catch (error) {
    console.error("Error in updating the count:", error);
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
