const express = require("express");
require("dotenv").config();
const cors = require("cors");
const apiRoutes = require("./apiRoutes");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get("/api/test", (req, res) => {
  res.json({ message: "CORS enabled!" });
});

app.get("", (req, res) => {
  res.send({ message: "Welcome to nodejs backend server" });
});

app.use("/v1", apiRoutes);

app.listen(PORT, () => {
  console.log(`App started running on port:${PORT}`);
});

module.exports = app; // Required for Vercel
