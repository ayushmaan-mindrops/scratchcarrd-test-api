const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
  try {
    const token = req?.headers?.authorization.split(" ")[1];
    console.log(token);
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
          return res.status(401).json({ error: "Unauthorized" });
        }
        req.userId = decoded.userId;
        req.username = decoded.username;
        req.email = decoded.email;
        req.role = decoded.role;
        // console.log(req.userId, req.username, req.email, req.role, decoded);
        next();
      });
    } else {
      return res.status(401).json({ error: "Unauthorized! No token found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Unauthorized" });
  }
};

module.exports = auth;
