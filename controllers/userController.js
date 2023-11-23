import connectDB from "../config/db.js";
import getJwtEmail from "./../utils/getJwtEmail.js";
import multerInstance from "./../multerInstance.js";

export const getProfileController = async (req, res) => {
  let connection;
  try {
    connection = await connectDB();
    const userEmail = getJwtEmail(req);
    const result = await connection.execute(
      `
      SELECT first_name, last_name, phone, address, image
      FROM Buyer
      WHERE email = :userEmail`,
      [userEmail]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, msg: "User not found" });
    }

    const profile = {};
    for (let i = 0; i < result.metaData.length; i++) {
      profile[result.metaData[i].name.toLowerCase()] = result.rows[0][i];
    }
    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Server error" });
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

export const getUpdateProfileController = async (req, res) => {
  let connection;
  try {
    const { firstName, lastName, phone, address1, address2 } = req.body;
    const userEmail = getJwtEmail(req);
    connection = await connectDB();

    const query = (key, value) => {
      // If the value is a string, enclose it in single quotes; otherwise, use as is
      const sanitizedValue = typeof value === "string" ? `'${value}'` : value;

      return `UPDATE Buyer
              SET ${key} = ${sanitizedValue}
              WHERE email = :userEmail`;
    };

    const result = await connection.execute(
      `SELECT * 
      FROM Buyer
      WHERE email = :userEmail`,
      [userEmail]
    );

    console.log(result.rows[0][1] + firstName);
    if (firstName && result.rows[0][1] !== firstName) {
      await connection.execute(query("first_name", firstName), [userEmail]);
      await connection.commit(); // Add this line
    }

    console.log(result.rows[0][2] + lastName);
    if (lastName && result.rows[0][2] !== lastName) {
      await connection.execute(query("last_name", lastName), [userEmail]);
      await connection.commit(); // Add this line
    }

    console.log(result.rows[0][5] + " " + phone);
    if (phone && result.rows[0][5] !== phone) {
      await connection.execute(query("phone", phone), [userEmail]);
      await connection.commit(); // Add this line
    }

    console.log(result.rows[0][6] + address1);
    if (address1 && result.rows[0][6] !== address1) {
      await connection.execute(query("address", address1), [userEmail]);
      await connection.commit(); // Add this line
    }

    res.json({ success: true, msg: "Info updated successfully" });
  } catch (e) {
    console.error(e);
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

export const getUpdateProfilePicController = async (req, res) => {
  const upload = multerInstance.single("img");
  upload(req, res, async (err) => {
    if (err?.message === "not supported format") {
      res.status(400).json({ success: false, msg: "not supported format" });
    } else if (err) {
      res.status(500).json({ success: false, msg: "server error" });
    }
    let connection;
    try {
      connection = await connectDB();
      // const filename = res.req.file.filename;
      const filename = req.file?.filename;
      console.log(filename);
      const email = getJwtEmail(req);

      // store filename in DB
      await connection.execute(
        `UPDATE Buyer
        SET image = :filename
        WHERE email = :email`,
        [filename, email]
      );
      await connection.commit(); // Add this line
      res.json({
        success: true,
        msg: "Profile picture updated successfully",
        img: filename,
      });
    } catch (e) {
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
  });
};
