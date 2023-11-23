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
            where email = :email`,
        [email]
      );
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
