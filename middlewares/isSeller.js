import Jwt from "jsonwebtoken";

const isSeller = (req, res, next) => {
  const token = req.get("Authorization");
  Jwt.verify(token, process.env.JWT_SECRET, (error, decode) => {
    if (error || !decode.role === "seller") {
      res.status(403).send("Unauthorized");
    } else {
      next();
    }
  });
};

export default isSeller;
