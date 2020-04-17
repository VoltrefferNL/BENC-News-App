const connection = require("../db/connection");

exports.getArticle = (article_id) => {
  return connection("articles")
    .select(
      "articles.author",
      "articles.title",
      "articles.body",
      "articles.article_id",
      "articles.topic",
      "articles.created_at",
      "articles.votes"
    )
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .count("comments.article_id AS comment_count")
    .groupBy("articles.article_id")
    .where({ "articles.article_id": article_id })
    .then((article) => {
      if (!article.length)
        return Promise.reject({
          status: 404,
          msg: `No article found for ${article_id}`,
        });
      return article;
    });
};

exports.updateVote = (article_id, inc_votes) => {
  return connection("articles")
    .where("article_id", article_id)
    .increment("votes", inc_votes || 0)
    .returning("*")
    .then((article) => {
      if (!article.length)
        return Promise.reject({
          status: 404,
          msg: `No article found for ${article_id}`,
        });
      return article[0];
    });
};

exports.getArticles = ({
  sort_by,
  order,
  author,
  topic,
  limit = 10,
  p = 1,
}) => {
  return connection("articles")
    .leftJoin("comments", "comments.article_id", "=", "articles.article_id")
    .select(
      "articles.author",
      "articles.title",
      "articles.article_id",
      "articles.topic",
      "articles.created_at",
      "articles.votes"
    )
    .groupBy("articles.article_id", "comments.article_id")
    .count("comments.article_id AS comment_count")
    .orderBy(sort_by || "created_at", order || "desc")
    .modify((articleQuery) => {
      if (author) articleQuery.where("articles.author", "=", author);
      if (topic) articleQuery.where("articles.topic", "=", topic);
    })
    .limit(limit)
    .offset((p - 1) * limit);
};

exports.checkInDb = (valueToCheck, column, table) => {
  return connection(table)
    .select("*")
    .where(column, valueToCheck)
    .then((results) => {
      return results.length !== 0;
    });
};
