const topicsRouter = require("express").Router();

const { sendAllTopics } = require("../controllers/topics.controllers");
const { send405Error } = require("../errors/");

topicsRouter.route("/").get(sendAllTopics).all(send405Error);

module.exports = topicsRouter;
