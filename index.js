const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const authenticationRouter = require("./routes/authentication");
const userRouter = require("./routes/userDetails");
const verifyToken = require("./middleware/authMiddleware");
const cookieParser = require("cookie-parser");

try {
  mongoose
    .connect(
      "mongodb+srv://gopichandreddy001:gopichandreddy@cluster0.6q8pxzh.mongodb.net/SimonGameDB?retryWrites=true&w=majority&appName=Cluster0",
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log("db connected"))
    .catch((err) => console.log(err));
} catch (err) {
  console.log(err.message);
}

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/", authenticationRouter);
app.use("/users", verifyToken, userRouter);

app.listen(8000, () => console.log("server started. Listening at port 8000"));

module.exports = app;
