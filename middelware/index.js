exports.checkPatchVotesBody = (req, res, next) => {
  if (Object.keys(req.body) > 1 || Object.keys(req.body)[0] !== "inc_votes") {
    next({
      status: 400,
      msg: "Bad request",
    });
  } else next();
};
