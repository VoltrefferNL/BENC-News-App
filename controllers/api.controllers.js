const endpoints = require("../endpoints.json");
const { send405Error } = require("../errors/");

exports.sendEndpoints = (req, res, next) => {
  res.status(200).send(endpoints).all(send405Error).catch(next);
};
