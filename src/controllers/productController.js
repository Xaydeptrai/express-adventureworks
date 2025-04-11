const productService = require("../services/product");

exports.getProducts = async (req, res) => {
  try {
    const { server } = req.params;
    const { page = 1, limit = 10, search = "" } = req.query;

    const result = await productService.getProducts(
      server,
      page,
      limit,
      search
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
