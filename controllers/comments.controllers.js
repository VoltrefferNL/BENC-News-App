const { updateComment } = require("../models/comments.models");

exports.patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateComment(comment_id, inc_votes)
    .then((comments) => {
      console.log({ comments });
      res.status(200).send({ comments });
    })
    .catch(next);
};
