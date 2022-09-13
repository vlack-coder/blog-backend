require("./db");
require("express-async-errors");
const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const postRouter = require("./routes/post");

const app = express();

app.use(morgan("dev"));
app.use("/api/post", postRouter);
app.use((err, req, res, next) => {
  console.log("err", err);
  res.status(500).json({error: err.message})
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("port is listening on " + PORT);
});
