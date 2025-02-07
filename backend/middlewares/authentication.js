const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const authentication = async (req, res, next) => {
  const authHeader = req.headers.cookie;
  console.log(authHeader);
  if (!authHeader) {
    return res.status(401).send("Authorization cookie missing");
  }

  const token = authHeader.split("=")[1];
  if (!token) {
    return res.send("No token found");
  }

  try {
    jwt.verify(token, process.env.secret_key, function (err, decoded) {
      if (err) {
        return res.send("err", err);
      }
      console.log(decoded);
      req.userId = decoded.userId;
      next();
    });
  } catch (err) {
    console.error(err);
    return res.status(404).send("Internal server error");
  }
};

module.exports = authentication;
