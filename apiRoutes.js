const express = require("express");
const createRouters = require("./src/builders/createRoutes");
const apiRoutes = express.Router();

apiRoutes.use("/:tableName", createRouters());

module.exports = apiRoutes;
