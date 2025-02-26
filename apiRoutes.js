const express = require("express");
const createRouters = require("./src/builders/createRoutes");
const apiRoutes = express.Router();

apiRoutes.use("/sales", createRouters("fact_sales"))
apiRoutes.use("/inventory", createRouters("fact_FP_inventory"))

module.exports = apiRoutes;