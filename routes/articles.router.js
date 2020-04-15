const articlesRouter = require("express").Router();
const {
  sendArticle,
  patchVotes,
  postComment,
} = require("../controllers/articles.controllers");
const { send405Error } = require("../errors/");
const { checkPatchVotesBody, checkPostCommentBody } = require("../middelware");

articlesRouter
  .route("/:article_id")
  .get(sendArticle)
  .patch(checkPatchVotesBody, patchVotes)
  .all(send405Error);

articlesRouter
  .route("/:article_id/comments")
  .post(checkPostCommentBody, postComment)
  .all(send405Error);

module.exports = articlesRouter;
