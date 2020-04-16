const articlesRouter = require("express").Router();
const {
  sendArticle,
  patchVotes,
  postComment,
  getComments,
  sendArticles,
} = require("../controllers/articles.controllers");

const { send405Error } = require("../errors/");
const { checkPatchVotesBody, checkPostCommentBody } = require("../middelware");

articlesRouter.route("/").get(sendArticles).all(send405Error);

articlesRouter
  .route("/:article_id")
  .get(sendArticle)
  .patch(checkPatchVotesBody, patchVotes)
  .all(send405Error);

articlesRouter
  .route("/:article_id/comments")
  .post(checkPostCommentBody, postComment)
  .get(getComments)
  .all(send405Error);

module.exports = articlesRouter;
