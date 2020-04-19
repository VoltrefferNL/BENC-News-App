exports.send405Error = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed" });
};

exports.handleInvalidPaths = (req, res, next) => {
  res.status(404).send({ msg: "Not Found dev err" });
};

exports.errorPSQL = (err, req, res, next) => {
  const codes = {
    "22P02": { status: 400, msg: "Bad request" },
    "23502": { status: 400, msg: "Bad request" },
    "23503": { status: 404, msg: "Value not found" },
    "42703": { status: 400, msg: "Bad request" },
  };
  if (err.code in codes) {
    const { status, msg } = codes[err.code];
    res.status(status).send({ msg });
  } else next(err);
};

exports.errorCustom = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  next(err);
};

exports.error500 = (err, req, res, next) => {
  res.status(500).send({ msg: "internal Server Error55" });
};
