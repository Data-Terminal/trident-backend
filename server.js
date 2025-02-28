const express = require("express");
require("dotenv").config();

const apiRoutes = require("./apiRoutes");
const app = express();
app.use(express.json());

app.get("", (req, res) => {
  res.send({ message: "Welcome to nodejs backend server" });
});
app.use("/v1", apiRoutes);

app.listen(process.env.PORT, () => {
  console.log(`App started running on port:${process.env.port}`);
});
