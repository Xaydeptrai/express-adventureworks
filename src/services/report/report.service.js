const sql = require("mssql");
const database = require("../../utils/db/db");
const { timedQuery } = require("../../utils/queryTimer");

exports.totalSalesBySubcategory = async (server = "master", year) => {
  const params = {};
  let whereClause = "";

  if (year) {
    params.year = { type: sql.Int, value: year };
    whereClause = "WHERE YEAR(soh.OrderDate) = @year";
  }

  const query = `
    SELECT 
      psc.Name AS SubcategoryName,
      SUM(sod.LineTotal) AS TotalSales
    FROM Sales.SalesOrderDetail sod
    JOIN Sales.SalesOrderHeader soh ON sod.SalesOrderID = soh.SalesOrderID
    JOIN Production.Product p ON sod.ProductID = p.ProductID
    JOIN Production.ProductSubcategory psc ON p.ProductSubcategoryID = psc.ProductSubcategoryID
    ${whereClause}
    GROUP BY psc.Name
    ORDER BY TotalSales DESC;
  `;

  const { result, timing } = await timedQuery("Sales by Subcategory", () =>
    database.query(server, query, params)
  );

  return {
    data: result.recordset,
    timing,
  };
};

exports.totalSalesByYearAndMonth = async (server = "master", year = null) => {
  const query = `
    SELECT 
      YEAR(soh.OrderDate) AS Year,
      MONTH(soh.OrderDate) AS Month,
      SUM(sod.LineTotal) AS MonthlySales
    FROM Sales.SalesOrderDetail sod
    JOIN Sales.SalesOrderHeader soh ON sod.SalesOrderID = soh.SalesOrderID
    WHERE (@year IS NULL OR YEAR(soh.OrderDate) = @year)
    GROUP BY YEAR(soh.OrderDate), MONTH(soh.OrderDate)
    ORDER BY Year, Month;
  `;

  const params = {
    year: { type: sql.Int, value: year ? parseInt(year, 10) : null },
  };

  const { result, timing } = await timedQuery("Sales by Year & Month", () =>
    database.query(server, query, params)
  );

  const records = result.recordset;

  const grouped = {};

  for (const { Year, Month, MonthlySales } of records) {
    if (!grouped[Year]) {
      grouped[Year] = {
        year: Year,
        totalSale: 0,
        monthlySales: {},
      };
    }

    grouped[Year].monthlySales[Month] = MonthlySales;
    grouped[Year].totalSale += MonthlySales;
  }

  return {
    data: Object.values(grouped),
    timing,
  };
};

exports.getCustomersByRevenue = async (
  server,
  page = 1,
  limit = 10,
  year = null
) => {
  const offset = (page - 1) * limit;

  const salesQuery = `
    SELECT 
      soh.CustomerID,
      SUM(soh.TotalDue) AS TotalSales
    FROM Sales.SalesOrderHeader soh
    WHERE soh.CustomerID IS NOT NULL
      ${year ? "AND YEAR(soh.OrderDate) = @year" : ""}
    GROUP BY soh.CustomerID
    ORDER BY TotalSales DESC
    OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;
  `;

  const params = {
    offset: { type: sql.Int, value: offset },
    limit: { type: sql.Int, value: limit },
  };

  if (year) {
    params.year = { type: sql.Int, value: year };
  }

  const { result, timing } = await timedQuery("Revenue Query", () =>
    database.query(server, salesQuery, params)
  );

  const records = result.recordset;

  // Lấy danh sách CustomerID
  const customerIds = records.map((r) => r.CustomerID);
  let customerNames = [];

  if (customerIds.length) {
    const nameParams = {};
    const namePlaceholders = customerIds
      .map((_, i) => {
        nameParams[`id${i}`] = { type: sql.Int, value: customerIds[i] };
        return `@id${i}`;
      })
      .join(",");

    const nameQuery = `
      SELECT 
        c.CustomerID,
        ISNULL(p.FirstName, '') + ' ' + ISNULL(p.LastName, '') AS FullName
      FROM Sales.Customer c
      LEFT JOIN Person.Person p ON c.PersonID = p.BusinessEntityID
      WHERE c.CustomerID IN (${namePlaceholders})
    `;

    const nameResult = await database.query("master", nameQuery, nameParams);
    customerNames = nameResult.recordset;
  }

  // Gộp tên khách hàng với doanh thu
  const final = records.map((r) => {
    const name = customerNames.find((n) => n.CustomerID === r.CustomerID);
    return {
      customerId: r.CustomerID,
      fullName: name?.FullName || "N/A",
      totalSales: r.TotalSales,
    };
  });

  return {
    data: final,
    pagination: {
      page,
      limit,
    },
    timing,
  };
};
