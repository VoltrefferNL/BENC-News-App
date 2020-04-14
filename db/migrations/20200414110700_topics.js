exports.up = function (knex) {
  console.log("creating topics table in database");
  return knex.schema.createTable("topics", (topicsTable) => {
    topicsTable.string("slug").primary();
    topicsTable.text("description");
  });
};

exports.down = function (knex) {
  console.log("Removing topics table from database");
  return knex.schema.dropTable("houses");
};
