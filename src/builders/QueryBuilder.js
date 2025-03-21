class QueryBuilder {
  constructor(supabase, tableName) {
    this.tableName = tableName;
    this.query = supabase.from(tableName);
  }

  #convertCamelToSnake(snakeCase) {
    return snakeCase.replace(/([A-Z])/g, "_$1").toLowerCase();
  }

  #convertSnakeToCamel(camelCase) {
    return camelCase.replace(/_([a-z])/g, (_, letter) => {
      return letter.toUpperCase();
    });
  }

  #deserilizeData(data) {
    let deSerilizedData = {};
    Object.keys(data).forEach((key) => {
      deSerilizedData[this.#convertSnakeToCamel(key)] = data[key];
    });
    return deSerilizedData;
  }

  #serilizeData(data) {
    let serlizedData = {};
    Object.keys(data).forEach((key) => {
      serlizedData[this.#convertCamelToSnake(key)] = data[key];
    });
    return serlizedData;
  }

  getAll() {
    const tableName = this.#convertCamelToSnake(this.tableName);
    console.log(`Fetching all the records from "${tableName}" table`);
    this.query = this.query.select();
    return this;
  }

  getBy({ column, matchingValue, projections = [] }) {
    if (!column || !matchingValue) return;
    let newColumnName = this.#convertCamelToSnake(column);
    console.log(
      `Fetching matched records from "${this.tableName}" table with column:${newColumnName},value:${matchingValue}`
    );
    this.query = this.query
      .select(projections.join(","))
      .eq(newColumnName, matchingValue);
    return this;
  }

  update({ column, matchingValue, data }) {
    if (!column || !matchingValue) return;
    console.log(
      `Updating a record using column:${this.#convertCamelToSnake(
        column
      )} matching with:${matchingValue}`
    );
    let serilizedData = this.#serilizeData(data);
    this.query = this.query
      .update(serilizedData)
      .eq(this.#convertCamelToSnake(column), matchingValue);
    return this;
  }

  delete({ column, matchingValue }) {
    if (!column || !matchingValue) return;
    let newColumnName = this.#convertCamelToSnake(column);
    console.log(
      `Deleting a record using column:${newColumnName} matching with:${matchingValue}`
    );
    this.query = this.query.delete().eq(newColumnName, matchingValue);
    return this;
  }

  deleteMany({ ids, field }) {
    let updatedField = this.#convertCamelToSnake(field);
    console.log(
      `Deleting multiple records matching with field:${updatedField} and ids:${ids}`
    );
    if (ids.length <= 0) return this;
    this.query = this.query.delete().in(updatedField, ids);
    return this;
  }

  insertMany(arrayObject) {
    const serilizedData = arrayObject.map((item) => this.#serilizeData(item));
    console.log(
      `Inserting a record into "${
        this.tableName
      }" table with data:${JSON.stringify(serilizedData)}`
    );
    this.query = this.query.insert(serilizedData);
    return this;
  }

  insert(dataObject) {
    if (Array.isArray(dataObject)) {
      return this.insertMany(dataObject);
    }
    console.log(
      `Inserting a record into "${
        this.tableName
      }" table with data:${JSON.stringify(dataObject)}`
    );
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
        updatedData = Array.isArray(data)
          ? data.map((item) => this.#deserilizeData(item))
          : this.#deserilizeData(data);
      }
      if (error) {
        throw new Error(error.message);
      }
      console.log(
        error
          ? "Operation unsuccessfull due to an error"
          : "Operation successfully"
      );
      return updatedData;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = QueryBuilder;
