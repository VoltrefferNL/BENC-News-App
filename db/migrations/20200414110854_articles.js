exports.up = function (knex) {
  console.log("creating articles table in database");
  return knex.schema.createTable("articles", (articlesTable) => {
    articlesTable.increments("article_id").primary();
    articlesTable.string("title").notNullable();
    articlesTable.text("body").notNullable();
    articlesTable.integer("votes").defaultTo(0);
    articlestable.string("topic").references("topics.slug").notNullable();
    articlesTable.string("author").references("users.username").notNullable();
    articlesTable.timestap("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {};
