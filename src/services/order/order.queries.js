exports.buildCountQuery = (filters) => {
  const whereClause = buildWhereClause(filters);

  return `
    SELECT COUNT(*) AS total
    FROM Sales.SalesOrderHeader soh
    ${whereClause};
  `;
};

exports.buildDataQuery = (filters) => {
  const whereClause = buildWhereClause(filters);

  return `
    SELECT 
      soh.SalesOrderID,
      soh.SalesOrderNumber,
      soh.OrderDate,
      soh.DueDate,
      soh.ShipDate,
      soh.Status,
      soh.TotalDue,
      soh.CustomerID
    FROM Sales.SalesOrderHeader soh
    ${whereClause}
    ORDER BY soh.SalesOrderID
    OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;
  `;
};

function buildWhereClause(filters) {
  const conditions = [];

  if (filters.search) {
    conditions.push("(soh.SalesOrderNumber LIKE @search)");
  }

  if (filters.orderDateFrom && filters.orderDateTo) {
    conditions.push("soh.OrderDate BETWEEN @orderDateFrom AND @orderDateTo");
  }

  if (filters.shipDateFrom && filters.shipDateTo) {
    conditions.push("soh.ShipDate BETWEEN @shipDateFrom AND @shipDateTo");
  }

  if (filters.dueDateFrom && filters.dueDateTo) {
    conditions.push("soh.DueDate BETWEEN @dueDateFrom AND @dueDateTo");
  }

  return conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";
}
