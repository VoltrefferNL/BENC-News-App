const { getUser } = require("../models/users.models");

exports.sendUser = (req, res, next) => {
  const { username } = req.params;
  getUser(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
