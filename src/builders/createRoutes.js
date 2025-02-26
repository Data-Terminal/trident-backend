const express = require("express");
const supabase = require("../supabase")
const QueryBuilder = require("./QueryBuilder")

const responseHandler = async (action, res) => {
    try {
        let data = await action.execute();
        res.status(200).send({
            data,
            message: "Success"
        })
    } catch (error) {
        res.status(500).send({
            message: error.message,
            error
        })
    }
}

const createRouters = (tableName) => {
    let router = express.Router();

    router.get("", async (req, res) => {
        let queryBuilder = new QueryBuilder(supabase, tableName);
        return await responseHandler(queryBuilder.getAll(), res);
    })

    router.get("/:column/:value", async (req, res) => {
        let { column, value } = req.params
        let queryBuilder = new QueryBuilder(supabase, tableName);
        return await responseHandler(queryBuilder.getBy({ column, value }), res)
    })

    router.post("/", async (req, res) => {
        let body = req.body;
        let queryBuilder = new QueryBuilder(supabase, tableName);
        return responseHandler(queryBuilder.insert(body), res);
    })

    return router;
}

module.exports = createRouters