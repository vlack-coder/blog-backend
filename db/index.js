const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/blog-site")
  .then(() => console.log("db connected"))
  .catch(() => console.log("db connect failed"));
