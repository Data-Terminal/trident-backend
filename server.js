const express = require("express");
require("dotenv").config();

const apiRoutes = require("./apiRoutes");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("", (req, res) => {
  res.send({ message: "Welcome to nodejs backend server" });
});
app.use("/v1", apiRoutes);

app.listen(PORT, () => {
  console.log(`App started running on port:${PORT}`);
});

module.exports = app; // Required for Vercel
