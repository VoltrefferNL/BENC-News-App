const { getUser } = require("../models/users.models");

exports.sendUser = (req, res, next) => {
  const { username } = req.params;
  getUser(username)
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};
