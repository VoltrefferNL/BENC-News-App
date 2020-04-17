const {
  getArticle,
  updateVote,
  postCommentToArticle,
  getCommentsOnArticle,
  getArticles,
  checkInDb,
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
  updateVote(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const postedComment = req.body;
  postCommentToArticle({ article_id }, postedComment)
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

exports.sendArticles = (req, res, next) => {
  const { author, topic } = req.query;
  Promise.all([getArticles(req.query)])
    .then(([articles]) => {
      const authorInDb = author ? checkInDb(author, "username", "users") : null;
      const topicInDb = topic ? checkInDb(topic, "slug", "topics") : null;
      return Promise.all([authorInDb, topicInDb, articles]);
    })
    .then(([authorInDb, topicInDb, articles]) => {
      if (authorInDb === false || topicInDb === false)
        return Promise.reject({
          status: 404,
          msg: `No articles found with ${req.query}.`,
        });
      else res.status(200).send({ articles });
    })
    .catch(next);
};
