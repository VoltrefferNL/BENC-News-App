const {
  getArticle,
  updateVote,

  getArticles,
  checkInDb,
  countArticles,
} = require("../models/articles.models");

exports.sendArticle = (req, res, next) => {
  const { article_id } = req.params;
  getArticle(article_id)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateVote(article_id, inc_votes)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.sendArticles = (req, res, next) => {
  const { author, topic } = req.query;
  Promise.all([getArticles(req.query), countArticles(req.query)])
    .then(([articles, total_count]) => {
      const authorInDb = author ? checkInDb(author, "username", "users") : null;
      const topicInDb = topic ? checkInDb(topic, "slug", "topics") : null;
      return Promise.all([authorInDb, topicInDb, articles, total_count]);
    })
    .then(([authorInDb, topicInDb, articles, total_count]) => {
      if (authorInDb === false || topicInDb === false)
        return Promise.reject({
          status: 404,
          msg: `No articles found with either topic or author.`,
        });
      else res.status(200).send({ articles, total_count });
    })
    .catch(next);
};
