const connection = require("../db/connection");

exports.getArticle = (article_id) => {
  return connection
    .select("articles.*")
    .from("articles")
    .leftJoin("comments", "comments.article_id", "=", "articles.article_id")
    .count("comments.article_id AS comment_count")
    .groupBy("articles.article_id")
    .where({ "articles.article_id": article_id })
    .then((article) => {
      if (!article.length) {
        return Promise.reject({
          status: 404,
          msg: `No article found for ${article_id}`,
        });
      }
      return article;
    });
};

exports.updateVote = (article_id, inc_votes) => {
  return connection
    .where("article_id", article_id)
    .increment("votes", inc_votes || 0)
    .returning("*")
    .from("articles")
    .then((article) => {
      if (!article.length) {
        return Promise.reject({
          status: 404,
          msg: `No article found for ${article_id}`,
        });
      }
      return article;
    });
};
