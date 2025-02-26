const express = require("express");
require('dotenv').config()

const apiRoutes = require("./apiRoutes");
const app = express();
app.use(express.json());

app.use("/v1", apiRoutes)

app.use((err, _, res) => {
    res.status(err.status || 500).json({ message: err.message });
});

app.listen(4000, () => {
    console.log("App started running")
})