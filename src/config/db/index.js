const master = require("./master");
const na = require("./na");
const eu = require("./eu");

module.exports = {
  master,
  na,
  eu,
  getAll: () => ({ master, na, eu }),
};
