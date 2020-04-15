const articlesRouter = require("express").Router();
const {
  sendArticle,
  patchVotes,
} = require("../controllers/articles.controllers");
const { send405Error } = require("../errors/");
const { checkPatchVotesBody } = require("../middelware");

articlesRouter
  .route("/:article_id")
  .get(sendArticle)
  .patch(checkPatchVotesBody, patchVotes)
  .all(send405Error);

module.exports = articlesRouter;
