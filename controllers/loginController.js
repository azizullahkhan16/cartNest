import connectDB from "../config/db.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

export const handleLoginController = async (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    const emailTest = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmail = emailTest.test(email);
    const validPassword = password.length > 7;

    if (!validEmail || !validPassword) {
      res
        .status(400)
        .json({ success: false, message: "Invalid Email or password." });
      return;
    }

    let connection;
    try {
      connection = await connectDB();
      const user = await connection.execute(
        `SELECT *
        FROM buyer
        WHERE buyer.email = :email
            `,
        [email]
      );
      const cart = await connection.execute(
        `SELECT *
        FROM cart
        WHERE cart.userEmail = :email
            `,
        [email]
      );
      const wishList = await connection.execute(
        `SELECT *
        FROM wishlist
        WHERE wishlist.userEmail = :email
            `,
        [email]
      );

      const userCart = {};
      if (cart?.rows.length != 0) {
        for (let i = 0; i < cart.metaData.length; i++) {
          userCart[cart.metaData[i].name.toLowerCase()] = cart.rows[0][i];
        }
      }

      const userWish = {};
      if (wishList?.rows.length) {
        for (let i = 0; i < wishList.metaData.length; i++) {
          userWish[wishList.metaData[i].name.toLowerCase()] =
            wishList.rows[0][i];
        }
      }
      console.log(user.rows[0]);
      console.log(userCart);
      console.log(userWish);

      if (user) {
        const verified = await bcrypt.compare(password, user.rows[0][4]);
        if (verified) {
          const JWT = Jwt.sign(
            { email: email, role: "user" },
            process.env.JWT_SECRET
          );

          const userData = {
            name: user.rows[0][1] + " " + user.rows[0][2],
            phone: user.rows[0][5],
            address: user.rows[0][6],
            image: user.rows[0][7],
            cart: cart.rows,
            wishlist: wishList.rows,
          };
          res.status(200).json({ token: JWT, role: "user", userData });
        } else {
          res
            .status(400)
            .json({ success: false, message: "Invalid password." });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Server error!" });
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          console.error("Error closing connection:", error);
        }
      }
    }
  } else {
    res
      .status(400)
      .send({ success: false, message: "Please provide all the credentials." });
  }
};

export const handleSellerLoginController = async (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    const emailTest = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmail = emailTest.test(email);
    const validPassword = password.length > 7;

    if (!validEmail || !validPassword) {
      res
        .status(400)
        .json({ success: false, message: "Invalid Email or password." });
      return;
    }

    let connection;
    try {
      connection = await connectDB();
      const seller = await connection.execute(
        `SELECT *
            FROM seller
            where email = :email`,
        [email]
      );
      if (seller) {
        const verified = await bcrypt.compare(password, seller.rows[0][4]);
        if (verified) {
          const JWT = Jwt.sign(
            { email: email, role: "seller" },
            process.env.JWT_SECRET
          );

          const sellerData = {
            name: seller.rows[0][1] + " " + seller.rows[0][2],
            phone: seller.rows[0][5],
            address: seller.rows[0][6],
          };

          res.status(200).json({ token: JWT, role: "seller", sellerData });
        } else {
          res
            .status(400)
            .json({ success: false, message: "Invalid password." });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Server error!" });
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          console.error("Error closing connection:", error);
        }
      }
    }
  } else {
    res
      .status(400)
      .send({ success: false, message: "Please provide all the credentials." });
  }
};
