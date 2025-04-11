const reportService = require("../services/report/report.service");

exports.getSalesBySubcategory = async (req, res) => {
  try {
    const { server } = req.params;
    const { year } = req.query;

    const result = await reportService.totalSalesBySubcategory(server, year);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.totalSalesByYearAndMonth = async (req, res) => {
  try {
    const { server } = req.params;
    const { year } = req.query;

    const result = await reportService.totalSalesByYearAndMonth(server, year);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCustomersByRevenue = async (req, res) => {
  try {
    const { server = "master" } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const result = await reportService.getCustomersByRevenue(
      server,
      parseInt(page),
      parseInt(limit)
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCustomersByRevenue = async (req, res) => {
  try {
    const { server } = req.params;
    const { page = 1, limit = 10, year = null } = req.query;

    const result = await reportService.getCustomersByRevenue(
      server,
      parseInt(page, 10),
      parseInt(limit, 10),
      year ? parseInt(year, 10) : null
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
