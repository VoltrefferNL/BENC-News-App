const connection = require("../db/connection");

exports.getUser = (username) => {
  return connection("users")
    .select("username", "avatar_url", "name")
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
