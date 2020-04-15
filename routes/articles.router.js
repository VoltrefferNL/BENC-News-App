const articlesRouter = require("express").Router();
const {
  sendArticle,
  patchVotes,
} = require("../controllers/articles.controllers");
const { send405Error } = require("../errors/");

articlesRouter
  .route("/:article_id")
  .get(sendArticle)
  .patch(patchVotes)
  .all(send405Error);

module.exports = articlesRouter;
