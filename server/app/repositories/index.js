const favoriterepositorySequelize = require("./favorite-repository-sequelize");
const tweetRepositorySequelize = require("./tweet-repository-sequelize");
const userRepositorySequelize = require("./user-repository-sequelize");

const database = "sequelize";

let favoriteRepository = null;
let tweetRepository = null;
let userRepository = null;
switch (database) {
  case "sequelize":
    favoriteRepository = favoriterepositorySequelize;
    tweetRepository = tweetRepositorySequelize;
    userRepository = userRepositorySequelize;
    break;
}

const repositories = {
  favoriteRepository,
  tweetRepository,
  userRepository
};

module.exports = repositories;
