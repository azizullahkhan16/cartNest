import oracledb from "oracledb";
import colors from "colors";

const connectDB = async () => {
  try {
    const connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectionString: process.env.DB_CONNECTSTRING,
    });

    console.log(`Connected to oracledb`.bgMagenta.white);

    return connection;
  } catch (error) {
    console.log(`Error in oracledb connection ${error}`.bgRed.white);
  }
};

export default connectDB;
