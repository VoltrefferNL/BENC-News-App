exports.send405Error = (req, res, next) => {
  res.status(405).send({ msg: "Method not allowed" });
};

exports.handleInvalidPaths = (req, res, next) => {
  res.status(404).send({ msg: "Not Found dev err" });
};

exports.errorPSQL = (err, req, res, next) => {
  const psqlCodes = ["42703"];
  console.log(err.code);
  console.log(err);
  if (psqlCodes.includes(err.code)) {
    res.status(400).send({ msg: "Bad request" });
  }
  next(err);
};

exports.errorCustom = (err, req, res, next) => {
  if (err.status) res.status(err.status).send({ msg: err.msg });
  next(err);
};

exports.error500 = (err, req, res, next) => {
  res.status(500).send({ msg: "internal Server Error55" });
};
