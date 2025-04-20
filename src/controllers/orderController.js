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

exports.getOrderDetail = async (req, res) => {
  try {
    const { server, orderId } = req.params;

    const result = await orderService.getOrderDetail(server, parseInt(orderId));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { server, orderId } = req.params;
    const orderData = req.body;

    let serversToUpdate = [server];

    if (server === "master") {
      serversToUpdate = ["na", "eu"];
    } else if (server === "na" || server === "eu") {
      serversToUpdate = ["master", server];
    }

    const updateResults = await Promise.all(
      serversToUpdate.map((s) =>
        orderService.updateOrder(s, orderId, orderData)
      )
    );

    res.json({
      message: "Cập nhật đơn hàng thành công.",
      updateResults,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
