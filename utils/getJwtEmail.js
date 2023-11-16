import Jwt from "jsonwebtoken";

const getJwtEmail = (req) => {
  const token = req.get("Authorization");
  const decodedToken = Jwt.decode(token, process.env.JWT_SECRET);
  return decodedToken?.email;
};

export default getJwtEmail;
