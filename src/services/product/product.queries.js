exports.buildCountQuery = (search) => {
  const whereClause = search
    ? "WHERE p.Name LIKE @search OR ps.Name LIKE @search"
    : "";
  return `
    SELECT COUNT(*) AS total
    FROM Production.Product p
    LEFT JOIN Production.ProductSubcategory ps
      ON p.ProductSubcategoryID = ps.ProductSubcategoryID
    ${whereClause};
  `;
};

exports.buildDataQuery = (search) => {
  const whereClause = search
    ? "WHERE p.Name LIKE @search OR ps.Name LIKE @search"
    : "";
  return `
    SELECT 
      p.ProductID, 
      p.Name AS ProductName,
      p.Color,
      p.ProductNumber,
      p.ListPrice,
      ps.Name AS SubcatalogName
    FROM Production.Product p
    LEFT JOIN Production.ProductSubcategory ps 
      ON p.ProductSubcategoryID = ps.ProductSubcategoryID
    ${whereClause}
    ORDER BY p.ProductID
    OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY;
  `;
};
