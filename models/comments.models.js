const connection = require("../db/connection");

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
