const express = require("express");
const createRouters = require("./src/builders/createRoutes");
const apiRoutes = express.Router();

apiRoutes.use("/sales", createRouters("fact_sales"))
apiRoutes.use("/inventory", createRouters("fact_fp_inventory"))
apiRoutes.use("/production", createRouters("fact_production"))

module.exports = apiRoutes;