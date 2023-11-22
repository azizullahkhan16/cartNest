import connectDB from "../config/db.js";
import getJwtEmail from "./../utils/getJwtEmail.js";

export const getProfileController = async (req, res) => {
  let connection;
  try {
    connection = await connectDB();
    const userEmail = getJwtEmail(req);
    const result = await connection.execute(
      `
      SELECT *
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

    console.log(profile);
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
