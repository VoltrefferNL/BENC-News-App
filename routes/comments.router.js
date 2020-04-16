const commentsRouter = require("express").Router();
const { patchComment } = require("../controllers/comments.controllers");
const { send405Error } = require("../errors");
const { checkPatchVotesBody } = require("../middelware");

commentsRouter
  .route("/:comment_id")
  .patch(checkPatchVotesBody, patchComment)
  .all(send405Error);

module.exports = commentsRouter;
