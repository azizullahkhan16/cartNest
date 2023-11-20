import Jwt from "jsonwebtoken";

const isUser = async (req, res, next) => {
  const token = req.get("Authorization");
  Jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
    if (err || !decode.role === "user") {
      res.status(403).send("Unauthorized");
    } else {
      next();
    }
  });
};

export default isUser;
