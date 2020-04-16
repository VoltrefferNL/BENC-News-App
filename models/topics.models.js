const connection = require("../db/connection");

exports.getAllTopics = () => {
  return connection("topics")
    .select("slug", "description")
    .orderBy("description");
};
