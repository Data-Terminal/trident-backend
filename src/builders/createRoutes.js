const express = require("express");
const supabase = require("../supabase")
const QueryBuilder = require("./QueryBuilder")

const createRouters = (tableName) => {
    let router = express.Router();

    const responseHandler = async ({ action, res }) => {
        try {
            let data = await action.execute();
            res.status(200).send({
                message: `Successfull operation from table:${tableName}`,
                data
            })
        } catch (error) {
            res.status(500).send({
                message: error.message,
                error
            })
        }
    }


    router.get("", async (req, res) => {
        let queryBuilder = new QueryBuilder(supabase, tableName);
        return await responseHandler({ action: queryBuilder.getAll(), res });
    })

    router.get("/:column/:matchingValue", async (req, res) => {
        let { column, matchingValue } = req.params
        let queryBuilder = new QueryBuilder(supabase, tableName);
        return await responseHandler({ action: queryBuilder.getBy({ column, matchingValue }), res })
    })

    router.post("", async (req, res) => {
        let body = req.body;
        let queryBuilder = new QueryBuilder(supabase, tableName);
        return responseHandler({ action: queryBuilder.insert(body), res });
    })

    router.patch("/:column/:matchingValue", async (req, res) => {
        const { column, matchingValue } = req.params
        const payload = req.body;

        let queryBuilder = new QueryBuilder(supabase, tableName)
        return await responseHandler({ action: queryBuilder.update({ column, matchingValue, data: payload }), res })
    })

    router.delete("/:column/:matchingValue", (req, res) => {
        const { column, matchingValue } = req.params
        let queryBuilder = new QueryBuilder(supabase, tableName)
        return responseHandler({ action: queryBuilder.delete({ column, matchingValue }), res });
    })

    return router;
}

module.exports = createRouters 