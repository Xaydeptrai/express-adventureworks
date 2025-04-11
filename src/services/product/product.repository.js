const database = require("../../utils/db/db");
const sql = require("mssql");
const { timedQuery } = require("../../utils/queryTimer");
const queries = require("./product.queries");

exports.fetchProducts = async (server, { offset, limit, search }) => {
  const params = {
    offset: { type: sql.Int, value: offset },
    limit: { type: sql.Int, value: limit },
  };

  if (search) {
    params.search = { type: sql.NVarChar, value: `%${search}%` };
  }

  const [countResult, dataResult] = await Promise.all([
    timedQuery("Count Products", () =>
      database.query(server, queries.buildCountQuery(search), params)
    ),
    timedQuery("Get Products", () =>
      database.query(server, queries.buildDataQuery(search), params)
    ),
  ]);

  return {
    totalItems: countResult.result.recordset[0].total,
    products: dataResult.result.recordset,
    timing: {
      countQuery: countResult.timing,
      dataQuery: dataResult.timing,
    },
  };
};
