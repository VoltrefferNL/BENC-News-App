const {
  updateComment,
  deleteComment,
  postCommentToArticle,
  getCommentsOnArticle,
} = require("../models/comments.models");

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const postedComment = req.body;
  postCommentToArticle({ article_id }, postedComment)
    .then(([comment]) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;
  getCommentsOnArticle({ article_id, sort_by, order })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateComment(comment_id, inc_votes)
    .then(([comment]) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  deleteComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
