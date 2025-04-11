const database = require("../../utils/db/db");
const sql = require("mssql");
const { timedQuery } = require("../../utils/queryTimer");
const queries = require("./order.queries");

exports.fetchOrders = async (
  server,
  {
    offset,
    limit,
    search,
    orderDateFrom,
    orderDateTo,
    shipDateFrom,
    shipDateTo,
    dueDateFrom,
    dueDateTo,
  }
) => {
  const params = {
    offset: { type: sql.Int, value: offset },
    limit: { type: sql.Int, value: limit },
  };

  if (search) {
    params.search = { type: sql.NVarChar, value: `%${search}%` };
  }

  if (orderDateFrom && orderDateTo) {
    params.orderDateFrom = { type: sql.DateTime, value: orderDateFrom };
    params.orderDateTo = { type: sql.DateTime, value: orderDateTo };
  }

  if (shipDateFrom && shipDateTo) {
    params.shipDateFrom = { type: sql.DateTime, value: shipDateFrom };
    params.shipDateTo = { type: sql.DateTime, value: shipDateTo };
  }

  if (dueDateFrom && dueDateTo) {
    params.dueDateFrom = { type: sql.DateTime, value: dueDateFrom };
    params.dueDateTo = { type: sql.DateTime, value: dueDateTo };
  }

  const [countResult, dataResult] = await Promise.all([
    timedQuery("Count Orders", () =>
      database.query(
        server,
        queries.buildCountQuery({
          search,
          orderDateFrom,
          orderDateTo,
          shipDateFrom,
          shipDateTo,
          dueDateFrom,
          dueDateTo,
        }),
        params
      )
    ),
    timedQuery("Get Orders", () =>
      database.query(
        server,
        queries.buildDataQuery({
          search,
          orderDateFrom,
          orderDateTo,
          shipDateFrom,
          shipDateTo,
          dueDateFrom,
          dueDateTo,
        }),
        params
      )
    ),
  ]);

  return {
    totalItems: countResult.result.recordset[0].total,
    orders: dataResult.result.recordset,
    timing: {
      countQuery: countResult.timing,
      dataQuery: dataResult.timing,
    },
  };
};

exports.fetchCustomerNames = async (server, customerIds) => {
  if (!customerIds.length) return [];

  const ids = customerIds.map((_, idx) => `@id${idx}`).join(", ");
  const params = {};

  customerIds.forEach((id, idx) => {
    params[`id${idx}`] = { type: sql.Int, value: id };
  });

  const query = `
    SELECT 
      c.CustomerID,
      p.FirstName,
      p.LastName
    FROM Sales.Customer c
    JOIN Person.Person p ON c.PersonID = p.BusinessEntityID
    WHERE c.CustomerID IN (${ids});
  `;

  const result = await database.query(server, query, params);
  return result.recordset;
};

exports.fetchOrderDetail = async (server, orderId) => {
  const query = `
    SELECT 
      sod.SalesOrderID,
      sod.SalesOrderDetailID,
      sod.ProductID,
      p.Name AS ProductName,
      sod.OrderQty,
      sod.UnitPrice,
      sod.UnitPriceDiscount,
      sod.LineTotal
    FROM Sales.SalesOrderDetail sod
    INNER JOIN Production.Product p ON p.ProductID = sod.ProductID
    WHERE sod.SalesOrderID = @orderId
  `;

  const params = {
    orderId: { type: sql.Int, value: orderId },
  };

  const { result, timing } = await timedQuery(
    `Fetch order details for ${orderId}`,
    () => database.query(server, query, params)
  );

  return {
    orderDetails: result.recordset,
    timing,
  };
};
