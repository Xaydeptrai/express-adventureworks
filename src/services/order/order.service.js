const repo = require("./order.repository");

exports.getOrders = async (
  server = "NA", // Chỉ nhận NA hoặc EU
  page = 1,
  limit = 10,
  search = "",
  orderDateFrom,
  orderDateTo,
  shipDateFrom,
  shipDateTo,
  dueDateFrom,
  dueDateTo
) => {
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const offset = (pageNumber - 1) * limitNumber;

  const { totalItems, orders, timing } = await repo.fetchOrders(server, {
    offset,
    limit: limitNumber,
    search,
    orderDateFrom,
    orderDateTo,
    shipDateFrom,
    shipDateTo,
    dueDateFrom,
    dueDateTo,
  });

  const customerIDs = [...new Set(orders.map((o) => o.CustomerID))];

  const customers = await repo.fetchCustomerNames("master", customerIDs);

  const customerMap = Object.fromEntries(
    customers.map((c) => [c.CustomerID, `${c.FirstName} ${c.LastName}`])
  );

  const enrichedOrders = orders.map((order) => ({
    ...order,
    customerName: customerMap[order.CustomerID] || "Không rõ",
  }));

  return {
    data: enrichedOrders,
    pagination: {
      totalItems,
      totalPages: Math.ceil(totalItems / limitNumber),
      page: pageNumber,
      limit: limitNumber,
    },
    timing,
  };
};

exports.getOrderDetail = async (server, orderId) => {
  const { orderDetails, timing } = await repo.fetchOrderDetail(server, orderId);

  return {
    data: orderDetails,
    timing,
  };
};
