const repo = require("./product.repository");

exports.getProducts = async (
  server = "master",
  page = 1,
  limit = 10,
  search = ""
) => {
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const offset = (pageNumber - 1) * limitNumber;

  const { totalItems, products, timing } = await repo.fetchProducts(server, {
    offset,
    limit: limitNumber,
    search,
  });

  return {
    data: products,
    pagination: {
      totalItems,
      totalPages: Math.ceil(totalItems / limitNumber),
      page: pageNumber,
      limit: limitNumber,
    },
    timing,
  };
};
