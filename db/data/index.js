const ENV = process.env.NODE_ENV || "development";

const test = require("./test-data");
const development = require("./development-data");

const data = { development, test };

module.exports = data[ENV];
