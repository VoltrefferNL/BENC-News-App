const express = require("express");
const app = express();
const apiRouter = require("./routes/api.router");
const {
  handleInvalidPaths,
  errorPSQL,
  errorCustom,
  error500,
} = require("./errors");
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

app.all("/*", handleInvalidPaths);

app.use(errorPSQL);
app.use(errorCustom);
app.use(error500);

module.exports = app;
