const topicsRouter = require("express").Router();
const { sendAllTopics } = require("../controllers/topics.controllers");
const { send405Error } = require("../errors/");

topicsRouter.get("/", sendAllTopics);

module.exports = topicsRouter;
