require("dotenv").config();
const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  console.log("middleware");
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(401).json({ error: "Access denied" });
  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decoded) => {
      if (err) return res.sendStatus(403);
      req.userId = decoded.userId;
      next();
    }
  );
}

module.exports = verifyToken;
