const {
  getArticle,
  updateVote,
  postCommentToArticle,
  getCommentsOnArticle,
} = require("../models/articles.models");

exports.sendArticle = (req, res, next) => {
  const { article_id } = req.params;
  getArticle(article_id)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.patchVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateVote(article_id, inc_votes, req.body)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const postedComment = req.body;
  postCommentToArticle(article_id, postedComment)
    .then((comment) => {
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
