const express = require("express");
const createRouters = require("./src/builders/CreateRoutes");
const apiRoutes = express.Router();

apiRoutes.use("/test", createRouters("testing_table"))
apiRoutes.use("/inventory", createRouters("fact_FP_inventory"))

module.exports = apiRoutes;