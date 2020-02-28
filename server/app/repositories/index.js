const tweetRepositorySequelize = require("./tweet-repository-sequelize");
const userRepositorySequelize = require("./user-repository-sequelize");

const database = "sequelize";

let tweetRepository = null;
let userRepository = null;
switch (database) {
  case "sequelize":
    tweetRepository = tweetRepositorySequelize;
    userRepository = userRepositorySequelize;
    break;
}

const repositories = {
  tweetRepository,
  userRepository
};

module.exports = repositories;
