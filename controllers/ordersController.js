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

export const getSingleOrderController = async (req, res) => {
  let connection;
  const email = getJwtEmail(req);
  const { id } = req.params;
  console.log(id + email);
  try {
    connection = await connectDB();

    const result = await connection.execute(
      `SELECT *
         FROM ((orders o
         LEFT JOIN product_category pc
         ON pc.product_id = o.product_id)
         LEFT JOIN seller s
         ON s.email = o.owner)
         WHERE o.owner = :email AND o.order_id = :id
        `,
      [email, id]
    );

    const order = {};
    for (let i = 0; i < result.metaData.length; i++) {
      order[result.metaData[i].name.toLowerCase()] = result.rows[0][i];
    }
    delete order.password;

    res.json({
      date: order.order_date,
      totalCost: order.total_cost,
      seller: {
        shopname: order.owner,
      },
      status: order.status,
      shippingAddress: order.shippingAddress,
      products: [
        {
          id: order.product_id,
        },
      ],
      productsElements: [
        {
          name: order.name,
          price: order.price,
          images: order.images,
          customizations: ["Customizations"],
        },
      ],
      subtotal: order.subtotal,
      shippingCost: order.shipping_cost,
      tax: order.tax,
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
