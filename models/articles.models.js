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
  return connection("articles")
    .where("article_id", article_id)
    .increment("votes", inc_votes || 0)
    .returning("*")
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

exports.postCommentToArticle = ({ article_id }, postedComment) => {
  return connection("comments")
    .insert({
      body: postedComment.body,
      article_id,
      author: postedComment.username,
    })
    .returning("*")
    .then((comment) => {
      return comment;
    });
};

exports.getCommentsOnArticle = ({ article_id, sort_by, order }) => {
  return connection("comments")
    .select("*")
    .where("article_id", article_id)
    .orderBy(sort_by || "created_at", order || "desc")
    .then((comments) => {
      if (!comments.length) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article_id: ${article_id}`,
        });
      }
      return comments;
    });
};

exports.getArticles = ({ sort_by, order, author, topic }) => {
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
      if (author) {
        articleQuery.where("articles.author", "=", author);
      }
    })
    .modify((articleQuery) => {
      if (topic) {
        articleQuery.where("articles.topic", "=", topic);
      }
    })
    .then((comments) => {
      if (!comments.length) {
        return Promise.reject({
          status: 404,
          msg: `No articles found by ${author} / ${topic}`,
        });
      }
      return comments;
    });
};

exports.checkInDb = (valueToCheck, column, table) => {
  return connection(table)
    .select("*")
    .where(column, valueToCheck)
    .then((results) => {
      return results.length !== 0;
    });
};
