const apiRouter = require("express").Router();

const { send405Error } = require("../errors/");
const { sendEndpoints } = require("../controllers/api.controllers");

const topicsRouter = require("./topics.router");
const usersRouter = require("./users.router");
const articlesRouter = require("./articles.router");
const commentsRouter = require("./comments.router");

apiRouter.route("/").get(sendEndpoints).all(send405Error);

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
