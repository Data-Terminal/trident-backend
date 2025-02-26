class QueryBuilder {
    constructor(supabase, tableName) {
        this.tableName = tableName;
        this.query = supabase.from(tableName);
    }

    #convertSnakeToCamel(snakeCase) {
        return snakeCase.replace(/([A-Z])/g, "_$1").toLowerCase();
    }

    #convertCamelToSnake(camelCase) {
        return camelCase.replace(/_([a-z])/g, (_, letter) => {
            return letter.toUpperCase();
        });
    }

    #deserilizeData(data) {
        let deSerilizedData = {};
        Object.keys(data).forEach(key => {
            deSerilizedData[this.#convertCamelToSnake(key)] = data[key];
        })
        return deSerilizedData;
    }

    #serilizeData(data) {
        let serlizedData = {};
        Object.keys(data).forEach(key => {
            serlizedData[this.#convertSnakeToCamel(key)] = data[key];
        })
        return serlizedData;
    }

    getAll() {
        console.log(`Fetching all the records from "${this.tableName}" table`)
        this.query = this.query.select();
        return this;
    }

    getBy({ column, value: matchingValue, projections = [] }) {
        console.log(`Fetching matched records from "${this.tableName}" table with column:${this.#convertSnakeToCamel(column)},value:${matchingValue}`);
        this.query = this.query.select(projections.join(",")).eq(this.#convertSnakeToCamel(column), matchingValue);
        return this;
    }

    update({ column, matchingValue, data }) {
        console.log(`Updating a record using column:${column} matching with:${matchingValue}`);
        let serilizedData = this.#serilizeData(data);
        this.query = this.query.update(serilizedData).eq(this.#convertSnakeToCamel(column), matchingValue);
        return this;
    }

    delete({ column, matchingValue }) {
        console.log(`Deleting a record using column:${column} matching with:${matchingValue}`);
        this.query = this.query.delete().eq(this.#convertSnakeToCamel(column), matchingValue);
        return this;
    }

    insert(dataObject) {
        console.log(`Inserting a record into "${this.tableName}" table with data:${JSON.stringify(dataObject)}`);
        let serilizedData = this.#serilizeData(dataObject);
        this.query = this.query.insert(serilizedData);
        return this;
    }

    single() {
        this.query = this.query.single();
        return this;
    }

    async execute() {
        try {
            let { data, error } = await this.query;
            let updatedData = [];
            if (data) {
                updatedData = Array.isArray(data) ? data.map(item => this.#deserilizeData(item)) : this.#deserilizeData(data)
            }
            if (error) {
                throw new Error(error.message);
            }
            console.log(error ? "Operation unsuccessfull due to an error" : "Operation successfully")
            return updatedData;
        } catch (error) {
            throw error
        }
    }
}


module.exports = QueryBuilder;