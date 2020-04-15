const { getArticle, updateVote } = require("../models/articles.models");
const { checkVotesBody } = require("../middelware");

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
