const connection = require("../db/connection");

exports.getUser = (username) => {
  return connection
    .select("username", "avatar_url", "name")
    .from("users")
    .where("username", username)
    .then((user) => {
      if (!user.length) {
        return Promise.reject({
          status: 404,
          msg: `No user found for ${username}`,
        });
      }
      return user;
    });
};
