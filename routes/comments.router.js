const commentsRouter = require("express").Router();
const {
  patchComment,
  deleteCommentById,
} = require("../controllers/comments.controllers");
const { send405Error } = require("../errors");
const { checkPatchVotesBody } = require("../middelware");

commentsRouter
  .route("/:comment_id")
  .patch(patchComment)
  .delete(deleteCommentById)
  .all(send405Error);

module.exports = commentsRouter;
