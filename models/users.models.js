const connection = require("../db/connection");

exports.getUser = () => {
  return connection.select("username", "avatar_url", "name").from("users");
};
