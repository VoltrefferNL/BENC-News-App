const { getArticle } = require("../models/articles.models");

exports.sendArticle = (req, res, next) => {
  const { article_id } = req.params;
  getArticle(article_id)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
