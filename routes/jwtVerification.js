const jwt = require("jsonwebtoken");
const jwtVerification = (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];
  if (!token) {
    return res.status(401).send("Access Denied");
  } else {
    jwt.verify(token, process.env.JWT_SECRET_TOKEN, (err, verified) => {
      if (err) {
        res.status(400).send("Invalid Token");
      } else {
        req.user = verified;
        next();
      }
    });
  }
};

module.exports = jwtVerification;
