import getJwtEmail from "../utils/getJwtEmail.js";
import connectDB from "./../config/db.js";
import oracledb from "oracledb";

const transformToInformationB = (informationA, products) => {
  const informationB = informationA.map((order) => {
    const transformedOrder = {
      _id: order.order_id, // Generate ObjectId or use the one from the order if available
      owner: order.useremail,
      seller: {
        shopName: order.store_name, // Assuming store_name is the equivalent of shopName
        email: order.email,
      },
      date: order.order_date,
      status: order.status,
      shippingAdress: order.shipping_address,
      productsElements: products.map((product) => ({
        name: product.name,
        product_id: product.product_id,
        quantity: product.quantity,
        unit_price: product.unit_price,
        total_price: product.total_price,
      })),
      totalCost: order.total_cost,
      subtotal: order.subtotal,
      shippingCost: order.shipping_cost,
      tax: order.tax,
    };

    return transformedOrder;
  });

  return informationB;
};

const transformToInformationBPart2 = (order, products) => {
  const transformedOrder = {
    _id: order.order_id, // Generate ObjectId or use the one from the order if available
    owner: order.useremail,
    seller: {
      shopName: order.store_name, // Assuming store_name is the equivalent of shopName
      email: order.email,
    },
    date: order.order_date,
    status: order.status,
    shippingAddress: order.shipping_address,
    productsElements: products.map((product) => ({
      name: product.name,
      product_id: product.product_id,
      quantity: product.quantity,
      unit_price: product.unit_price,
      total_price: product.total_price,
      image: product.image,
    })),
    totalCost: order.total_cost,
    subtotal: order.subtotal,
    shippingCost: order.shipping_cost,
    tax: order.tax,
  };

  return transformedOrder;
};

export const getOrderController = async (req, res) => {
  let connection;
  const email = getJwtEmail(req);
  try {
    connection = await connectDB();
    const result = await connection.execute(
      `SELECT *
      FROM orders o
      WHERE o.useremail = :email
      ORDER BY o.order_date DESC`,
      [email]
    );

    const productResult = await connection.execute(
      `SELECT *
      FROM (
          (orders o
          LEFT JOIN order_item oi ON oi.order_id = o.order_id)
          LEFT JOIN product_category pc ON pc.product_id = oi.product_id)
      WHERE o.useremail = :email`,
      [email]
    );

    let products;
    if (productResult.rows.length != 0) {
      // Convert ResultSet to an array of objects
      products = productResult.rows.map((row) => {
        const product = {};
        for (let i = 0; i < productResult.metaData.length; i++) {
          product[productResult.metaData[i].name.toLowerCase()] = row[i];
        }
        return product;
      });
    }

    let orders;
    if (result.rows.length != 0) {
      // Convert ResultSet to an array of objects
      orders = result.rows.map((row) => {
        const order = {};
        for (let i = 0; i < result.metaData.length; i++) {
          order[result.metaData[i].name.toLowerCase()] = row[i];
        }
        return order;
      });

      const informationB = transformToInformationB(orders, products);

      console.log(informationB);
      res.json(informationB);
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
  const { id } = req.params;
  const email = getJwtEmail(req);
  try {
    connection = await connectDB();
    const result = await connection.execute(
      `SELECT *
      FROM (
          (orders o
          LEFT JOIN seller s ON s.email = o.useremail)
          LEFT JOIN store st ON st.store_owner = s.seller_id
          )
      WHERE o.useremail = :email AND o.order_id = :id
      ORDER BY o.order_date DESC`,
      [email, id]
    );

    const productResult = await connection.execute(
      `SELECT *
      FROM (
          (orders o
          LEFT JOIN order_item oi ON oi.order_id = o.order_id)
          LEFT JOIN product_category pc ON pc.product_id = oi.product_id)
      WHERE o.useremail = :email`,
      [email]
    );

    let products;
    if (productResult.rows.length != 0) {
      // Convert ResultSet to an array of objects
      products = productResult.rows.map((row) => {
        const product = {};
        for (let i = 0; i < productResult.metaData.length; i++) {
          product[productResult.metaData[i].name.toLowerCase()] = row[i];
        }
        return product;
      });
    }

    const order = {};
    for (let i = 0; i < result.metaData.length; i++) {
      order[result.metaData[i].name.toLowerCase()] = result.rows[0][i];
    }

    const informationB = transformToInformationBPart2(order, products);

    console.log(informationB);
    res.json(informationB);
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
    WHERE useremail = :email AND is_deleted = 0`,
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

    let totalCost, shippingCost, tax;
    let subtotal = 0;
    let sellers = [];
    for (let i = 0; i < products.length; i++) {
      subtotal += products[i].price * carts[i].count;
      sellers.push(products[i].owner);
    }

    tax = Math.round(0.08 * subtotal);
    shippingCost = 6000;
    totalCost = subtotal + tax + shippingCost;
    const order_id_result = await connection.execute(
      `BEGIN :order_id := insert_order(:email, :address, :totalCost, :subtotal, :shippingCost, :tax); END;`,
      {
        email,
        address,
        totalCost,
        subtotal,
        shippingCost,
        tax,
        order_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      },
      { autoCommit: true }
    );

    const order_id = order_id_result.outBinds.order_id;
    console.log("Last inserted order_id:", order_id);

    for (let i = 0; i < products.length; i++) {
      const product_id = products[i].product_id;
      const count = carts[i].count;
      const unit_price = products[i].price;
      const total_price = unit_price * count;
      const seller = sellers[i];
      await connection.execute(
        `INSERT INTO order_item (order_id, seller, product_id, quantity, unit_price, total_price)
          values (:order_id, :seller, :product_id, :count, :unit_price, :total_price)`,
        [order_id, seller, product_id, count, unit_price, total_price],
        { autoCommit: true }
      );
    }
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

export const getSellerOrderController = async (req, res) => {
  let connection;
  const email = getJwtEmail(req);
  try {
    connection = await connectDB();
    const result = await connection.execute(
      `SELECT *
      FROM (order_item oi
        LEFT JOIN orders o ON o.order_id = oi.order_id)
      WHERE oi.seller = :email`,
      [email]
    );

    let orders;
    if (result.rows.length != 0) {
      // Convert ResultSet to an array of objects
      orders = result.rows.map((row) => {
        const order = {};
        for (let i = 0; i < result.metaData.length; i++) {
          order[result.metaData[i].name.toLowerCase()] = row[i];
        }
        return order;
      });

      console.log(orders);
      res.json(orders);
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
