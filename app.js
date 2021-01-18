const express = require("express");
const bodyParser = require("body-parser");
const auth = require("./middleware/auth");

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-with,Content-Type,Accept,Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT", "GET", "DELETE", "PATCH");
    return res.status(200).json({});
  }
  next();
});

app.use("/product", require("./routes/products"));
app.use("/order", require("./routes/orders"));
app.use("/user", require("./routes/users"));

app.use("/uploads", express.static("uploads"));
const db = require("./config/db");
db();

app.listen(4000, () => {
  console.log("Server start in port : 4000");
});
