const express = require("express");
const createRouters = require("./src/builders/createRoutes");
const apiRoutes = express.Router();
var cors = require("cors");

apiRoutes.use(cors());

apiRoutes.use("/:tableName", createRouters());

module.exports = apiRoutes;
