exports.up = function (knex) {
  console.log("creating users table in database");
  return knex.schema.createTable("users", (usersTable) => {
    usersTable.string("username").primary().unique();
    usersTable.string("avatar_url").notNullable();
    usersTable.string("name").notNullable();
  });
};

exports.down = function (knex) {
  console.log("Removing users table from database");
  return knex.schema.dropTable("users");
};
