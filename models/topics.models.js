const connection = require("../db/connection");

exports.getAllTopics = () => {
  return connection
    .select("slug", "description")
    .from("topics")
    .orderBy("description");
};
