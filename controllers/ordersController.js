import getJwtEmail from "../utils/getJwtEmail.js";
import connectDB from "./../config/db.js";

export const getOrderController = async (req, res) => {
  let connection;
  const email = getJwtEmail(req);
  try {
    connection = await connectDB();
    const result = await connection.execute(
      `SELECT *
         FROM ((orders o
         LEFT JOIN product_category pc
         ON pc.product_id = o.product_id)
         LEFT JOIN seller s
         ON s.email = o.owner)
         WHERE o.owner = :email
        `,
      [email]
    );

    const orders = {};
    for (let i = 0; i < result.metaData.length; i++) {
      orders[result.metaData[i].name.toLowerCase()] = result.rows[0][i];
    }
    delete orders.password;
    console.log(orders);
    res.json([
      {
        date: orders.order_date,
        totalCost: orders.total_cost,
        status: orders.status,
        productsElements: [orders.name],
        _id: orders.order_id,
      },
    ]);
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
