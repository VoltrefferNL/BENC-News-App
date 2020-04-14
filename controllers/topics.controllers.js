const { getAllTopics } = require("../models/topics.models");

exports.sendAllTopics = (req, res, next) => {
  getAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};
