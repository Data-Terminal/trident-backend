const express = require("express");
const supabase = require("../supabase");
const QueryBuilder = require("./QueryBuilder");

const createRouters = () => {
  let router = express.Router({ mergeParams: true });

  const responseHandler = async ({ action, res, tableName }) => {
    try {
      let data = await action.execute();
      res.status(200).send({
        message: `Successfull operation from table:${tableName}`,
        data,
      });
    } catch (error) {
      console.log({ error });
      res.status(500).send({
        message: error.message,
        error,
      });
    }
  };

  router.get("", async (req, res) => {
    let { tableName } = req.params;
    let queryBuilder = new QueryBuilder(supabase, tableName);
    return await responseHandler({
      action: queryBuilder.getAll(),
      res,
      tableName,
    });
  });

  router.get("/:column/:matchingValue", async (req, res) => {
    let { column, matchingValue, tableName } = req.params;
    let queryBuilder = new QueryBuilder(supabase, tableName);
    return await responseHandler({
      action: queryBuilder.getBy({ column, matchingValue }),
      res,
      tableName,
    });
  });

  router.post("", async (req, res, next) => {
    let body = req.body;
    let { tableName } = req.params;
    let queryBuilder = new QueryBuilder(supabase, tableName);
    if (body.type === "delete") {
      return responseHandler({
        action: queryBuilder.deleteMany({
          ids: body?.ids ?? [],
          field: body.field ?? "",
        }),
        res,
        tableName,
      });
    } else {
      return responseHandler({
        action: queryBuilder.insert(body),
        res,
        tableName,
      });
    }
  });

  router.patch("/:column/:matchingValue", async (req, res) => {
    const { column, matchingValue, tableName } = req.params;
    const payload = req.body;

    let queryBuilder = new QueryBuilder(supabase, tableName);
    return await responseHandler({
      action: queryBuilder.update({ column, matchingValue, data: payload }),
      res,
      tableName,
    });
  });

  router.delete("/:column/:matchingValue", (req, res) => {
    const { column, matchingValue, tableName } = req.params;
    let queryBuilder = new QueryBuilder(supabase, tableName);
    return responseHandler({
      action: queryBuilder.delete({ column, matchingValue }),
      res,
      tableName,
    });
  });
  return router;
};

module.exports = createRouters;
