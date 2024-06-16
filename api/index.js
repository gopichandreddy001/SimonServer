const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const authenticationRouter = require("./routes/authentication");
const userRouter = require("./routes/userDetails");
const verifyToken = require("./middleware/authMiddleware");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

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

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allow requests from localhost or 127.0.0.1, regardless of port
    if (
      origin.startsWith("http://localhost") ||
      origin.startsWith("http://127.0.0.1") ||
      origin.startsWith("https://simon-frontend.vercel.app")
    ) {
      return callback(null, true);
    }

    const msg =
      "The CORS policy for this site does not allow access from the specified Origin.";
    return callback(new Error(msg), false);
  },
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", authenticationRouter);
app.use("/users", verifyToken, userRouter);

app.listen(8000, () => console.log("server started. Listening at port 8000"));

module.exports = app;
