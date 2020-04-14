const connection = require("../db/connection");

exports.getAllTopics = () => {
  return connection.select("*").from("topics");
};
