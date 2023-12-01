import getJwtEmail from "../utils/getJwtEmail.js";
import connectDB from "./../config/db.js";

export const getOrderController = async (req, res) => {
  let connection;
  const email = getJwtEmail(req);
  try {
    connection = await connectDB();
    const result = await connection.execute(
      `SELECT *
      FROM (
          ((orders o
          LEFT JOIN order_items oi ON oi.order_id = o.order_id)
          LEFT JOIN product_category pc ON pc.product_id = oi.product_id)
          LEFT JOIN seller s ON s.email = o.owner
      )
      WHERE o.owner = :email
      ORDER BY o.order_date DESC`,
      [email]
    );

    if (result.rows.length != 0) {
      const orders = {};
      for (let i = 0; i < result.metaData.length; i++) {
        orders[result.metaData[i].name.toLowerCase()] = result.rows[0][i];
      }
      delete orders.password;
      console.log(orders.price);
      res.json([
        {
          date: orders.order_date,
          totalCost: orders.total_cost,
          status: orders.status,
          productsElements: [
            {
              name: orders.name,
              price: orders.price,
              images: orders.images,
            },
          ],
          _id: orders.order_id,
        },
      ]);
    } else {
      res.json({ msg: "No orders found" });
    }
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
         FROM (((orders o
          LEFT JOIN order_items oi
           ON o.order_id = oi.order_id)
         LEFT JOIN product_category pc
         ON pc.product_id = oi.product_id)
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

    console.log(order);

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

export const placeOrderController = async (req, res) => {
  let connection;
  const email = getJwtEmail(req);
  const { address } = req.body;
  try {
    connection = await connectDB();
    const cartResult = await connection.execute(
      `
    SELECT * 
    FROM cart
    WHERE userEmail = :email`,
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
        productId = cartResult.rows[i][3];

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

    //separate products by seller
    const orders = new Map();
    products.forEach((el) => {
      if (!orders.has(el.owner)) {
        orders.set(el.owner, [
          carts.find((e) => el.product_id === e.product_id),
        ]);
      } else {
        orders
          .get(el.owner)
          .push(carts.find((e) => el.product_id === e.product_id));
      }
    });
    console.log(carts);
    console.log(products);
    console.log(orders);

    const finalOrders = [];
    let orderEntry;
    const currentDate = new Date();
    console.log(currentDate);
    for (const [seller, items] of orders) {
      const subtotal = items.reduce((p, el) => {
        return p + products.find((e) => e.product_id === el.product_id).price;
      }, 0);
      console.log(subtotal);
      const tax = Math.round(0.08 * subtotal);
      const shippingCost = 6000;
      const totalCost = subtotal + tax + shippingCost;
      orderEntry = await connection.execute(
        `INSERT INTO orders (owner, seller, order_date, shipping_address, total_cost, subtotal, shipping_cost, tax)
        VALUES (:email, :seller, :currentDate, :address, :total, :subtotal, :shipping_cost, :tax)`,
        [
          email,
          seller,
          currentDate,
          address,
          totalCost,
          subtotal,
          shippingCost,
          tax,
        ],
        { autoCommit: true }
      );
      const o = {
        owner: email,
        seller,
        date: currentDate,
        shippingAdress: address,
        products: items,
        totalCost,
        subtotal,
        shippingCost,
        tax,
      };
      finalOrders.push(o);
    }

    const getOrder = await connection.execute(
      `SELECT order_id
      FROM orders
      WHERE owner = :email`,
      [email]
    );

    const order_id = getOrder.rows[0][0];

    for (let i = 0; i < products.length; i++) {
      const product_id = products[i].product_id;
      const count = carts[i].count;
      const unit_price = products[i].price;
      const total_price = unit_price * count;
      await connection.execute(
        `INSERT INTO order_items (order_id, product_id, count, unit_price, total_price)
          values (:order_id, :product_id, :count, :unit_price, :total_price)`,
        [order_id, product_id, count, unit_price, total_price],
        { autoCommit: true }
      );
    }

    console.log("final orders: ");
    console.log(finalOrders);
    console.log(orderEntry);
    console.log(getOrder);
    res.json({ msg: "order added successfully" });
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
