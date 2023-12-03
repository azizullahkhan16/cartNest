import oracledb from "oracledb";
import bcrypt from "bcrypt";
import connectDB from "../config/db.js";

export const handleSignUpController = async (req, res) => {
  const { firstName, lastName, email, password, phone, address } = req.body;
  if (firstName && lastName && email && password && phone && address) {
    const emailTest = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmail = emailTest.test(email);
    const validPassword = password.length > 7;
    if (!validEmail || !validPassword) {
      res
        .status(400)
        .send({ success: false, message: "Invalid email or password" });
      return;
    }
    let connection;
    try {
      connection = await connectDB();
      const result = await connection.execute(
        `SELECT COUNT(*) AS user_count
           FROM buyer
           WHERE email = :email`,
        [email]
      );
      const userCount = result.rows[0];
      if (userCount == 0) {
        const hashedPassword = await bcrypt.hash(password, 10);
        // Insert a new user into the buyer table
        const result = await connection.execute(
          `INSERT INTO buyer (first_name, last_name, email, password, phone, address)
             VALUES (:firstName, :lastName, :email, :hashedPassword, :phone, :address)`,
          [firstName, lastName, email, hashedPassword, phone, address],
          { autoCommit: true } // Auto-commit the transaction
        );
        if (result) {
          res.json({ success: true, msg: "User sign up succeeded" });
          return;
        }
      } else {
        res.status(400).json({ success: false, msg: "User already exist" });
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ success: false, message: "Server error" });
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

export const handleSellerSignUpController = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    address,
    store,
    storeType,
    storeDesp,
  } = req.body;

  console.log(req.body);
  if (
    firstName &&
    lastName &&
    email &&
    password &&
    phone &&
    address &&
    store &&
    storeType &&
    storeDesp
  ) {
    const emailTest = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmail = emailTest.test(email);
    const validPassword = password.length > 7;
    if (!validEmail || !validPassword) {
      res
        .status(400)
        .send({ success: false, message: "Invalid email or password" });
      return;
    }
    let connection;
    try {
      connection = await connectDB();
      const result = await connection.execute(
        `SELECT COUNT(*) AS user_count
           FROM seller
           WHERE email = :email`,
        [email]
      );
      const userCount = result.rows[0];
      console.log(userCount);
      if (userCount == 0) {
        const hashedPassword = await bcrypt.hash(password, 10);
        // Insert a new user into the buyer table
        const result = await connection.execute(
          `INSERT INTO seller (first_name, last_name, email, password, phone, address)
             VALUES (:firstName, :lastName, :email, :hashedPassword, :phone, :address)`,
          [firstName, lastName, email, hashedPassword, phone, address],
          { autoCommit: true } // Auto-commit the transaction
        );
        if (result) {
          res.json({ success: true, msg: "Seller Sign up succeeded" });
          return;
        }
      } else {
        res.status(400).json({ success: false, msg: "Seller already exist" });
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ success: false, message: "Server error" });
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
