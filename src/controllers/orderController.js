const orderService = require("../services/order");

exports.getOrders = async (req, res) => {
  try {
    const { server } = req.params;
    const {
      page = 1,
      limit = 10,
      search = "",
      orderDateFrom,
      orderDateTo,
      shipDateFrom,
      shipDateTo,
      dueDateFrom,
      dueDateTo,
    } = req.query;

    const result = await orderService.getOrders(
      server,
      page,
      limit,
      search,
      orderDateFrom,
      orderDateTo,
      shipDateFrom,
      shipDateTo,
      dueDateFrom,
      dueDateTo
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
