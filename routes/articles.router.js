const articlesRouter = require("express").Router();
const { sendArticle } = require("../controllers/articles.controllers");
const { send405Error } = require("../errors/");

articlesRouter.route("/:article_id").get(sendArticle).all(send405Error);

module.exports = articlesRouter;
