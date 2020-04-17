const connection = require("../db/connection");

exports.postCommentToArticle = ({ article_id }, postedComment) => {
  return connection("comments")
    .insert({
      body: postedComment.body,
      article_id,
      author: postedComment.username,
    })
    .returning("*");
};

exports.getCommentsOnArticle = ({ article_id, sort_by, order }) => {
  return connection("comments")
    .select("*")
    .where("article_id", article_id)
    .orderBy(sort_by || "created_at", order || "desc");
};

exports.updateComment = (comment_id, inc_votes) => {
  return connection("comments")
    .where("comment_id", comment_id)
    .increment("votes", inc_votes)
    .returning("*")
    .then((comments) => {
      if (!comments.length) {
        return Promise.reject({
          status: 404,
          msg: `No comment found for ${comment_id}`,
        });
      }
      return comments;
    });
};

exports.deleteComment = (comment_id) => {
  return connection("comments")
    .del()
    .where({ comment_id })
    .then((comments) => {
      if (comments === 0)
        return Promise.reject({
          status: 404,
          msg: `No comment found for ${comment_id}`,
        });
      return comments;
    });
};
