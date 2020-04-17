const articlesRouter = require("express").Router();

const {
  sendArticle,
  patchVotes,
  sendArticles,
} = require("../controllers/articles.controllers");
const {
  postComment,
  getComments,
} = require("../controllers/comments.controllers");
const { send405Error } = require("../errors/");
const { checkPostCommentBody } = require("../middelware");

articlesRouter.route("/").get(sendArticles).all(send405Error);

articlesRouter
  .route("/:article_id")
  .get(sendArticle)
  .patch(patchVotes)
  .all(send405Error);

articlesRouter
  .route("/:article_id/comments")
  .post(checkPostCommentBody, postComment)
  .get(getComments)
  .all(send405Error);

module.exports = articlesRouter;
